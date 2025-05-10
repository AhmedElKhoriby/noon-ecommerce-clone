import { Cart, Prisma } from '@prisma/client';
import db from '../config/db.config';
import { AddToCartInput, UpdateCartItemInput, RemoveCartItemInput, ApplyCouponInput } from '../schemas/cart.schema';
import AppError from '../errors/appError';

type FullCart = Prisma.CartGetPayload<{
  include: {
    CartItem: {
      include: {
        product: true;
      };
    };
  };
}>;

const updateCartWithTotals = async (cart: Cart, discount?: number): Promise<FullCart> => {
  const cartItems = await db.cartItem.findMany({
    where: { cartId: cart.id },
    select: { price: true, quantity: true },
  });

  const totalCartPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  let totalPriceAfterDiscount = totalCartPrice; // القيمة الافتراضية بدون خصم
  if (discount) {
    totalPriceAfterDiscount = Number((totalCartPrice * (1 - discount / 100)).toFixed(2));
  }

  return await db.cart.update({
    where: { id: cart.id },
    data: { totalCartPrice, totalPriceAfterDiscount },
    include: { CartItem: { include: { product: true } } },
  });
};

export const addToCart = async (userId: string, input: AddToCartInput['body']): Promise<FullCart> => {
  const { productId, color, quantity } = input;

  let cart = await db.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await db.cart.create({ data: { userId } });
  }

  const product = await db.product.findUniqueOrThrow({
    where: { id: productId },
    select: { price: true },
  });

  const cartItem = await db.cartItem.upsert({
    where: {
      cartId_productId_color: {
        cartId: cart.id,
        productId,
        color,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      quantity,
      color,
      price: product.price,
      productId,
      cartId: cart.id,
    },
  });

  // Update cart totals
  return await updateCartWithTotals(cart);
};

export const getCart = async (userId: string): Promise<FullCart> => {
  return await db.cart.findUniqueOrThrow({
    where: { userId },
    include: {
      CartItem: {
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const updateCartItemQuantity = async (userId: string, input: UpdateCartItemInput): Promise<FullCart> => {
  const { itemId } = input.params;
  const { quantity } = input.body;

  // Verify cart ownership
  const cart = await getCart(userId);

  // Update item quantity
  await db.cartItem.update({
    where: {
      id: itemId,
      cartId: cart.id,
    },
    data: {
      quantity,
    },
  });

  // Update cart totals
  return await updateCartWithTotals(cart);
};

export const removeCartItem = async (userId: string, input: RemoveCartItemInput): Promise<FullCart> => {
  const { itemId } = input.params;

  // Verify cart ownership
  const cart = await getCart(userId);

  // Delete item quantity
  await db.cartItem.delete({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  // Update cart totals
  return await updateCartWithTotals(cart);
};

export const clearCart = async (userId: string): Promise<void> => {
  await db.cart.delete({
    where: {
      userId,
    },
  });
};

export const applyCoupon = async (userId: string, input: ApplyCouponInput['body']): Promise<FullCart> => {
  const { coupon } = input;
  // Check coupon validity
  const couponData = await db.coupon.findFirst({
    where: {
      name: coupon,
      expire: { gt: new Date() },
      active: true,
    },
  });

  if (!couponData) {
    throw AppError.custom(400, 'Invalid or expired coupon.');
  }
  // Get cart
  const cart = await getCart(userId);

  // Update cart totals
  return await updateCartWithTotals(cart, couponData.discount);
};
