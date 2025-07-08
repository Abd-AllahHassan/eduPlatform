"use client"

import { useCart } from "../../context/CartContext"
import { usePayForLesson } from "../../hooks/useStudent"

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { mutate: payForLesson, isPending } = usePayForLesson()

  const handleCheckout = async () => {
    try {
      for (const lesson of cartItems) {
        await payForLesson(lesson._id)
      }
      clearCart()
      alert("🎉 Payment successful! Check your purchased lessons.")
    } catch (error) {
      alert("❌ Payment failed. Please try again.")
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">🛒</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
          <p className="text-gray-500 mb-8 text-lg">Browse lessons and add them to your cart to get started.</p>
          <a
            href="/student/lessons"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="mr-2">📚</span>
            Browse Lessons
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart 🛒</h1>
        <p className="text-yellow-100 text-lg">Review your selected lessons before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((lesson) => (
            <div key={lesson._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">📚</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">Class {lesson.classLevel}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">${lesson.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${(lesson.price * 1.5).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(lesson._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span className="text-green-600">-${(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${(getTotalPrice() * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg mb-4"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </div>
            ) : (
              "Proceed to Checkout"
            )}
          </button>

          <button
            onClick={clearCart}
            className="w-full text-gray-600 py-3 text-sm hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}
