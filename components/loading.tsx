export function Loading({ message = "Loading" }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] rounded-full animate-spin border-t-[#1ABC9C]"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-[#1ABC9C] opacity-20"></div>
        </div>

        {/* Animated text */}
        <div className="flex items-center gap-1">
          <span className="text-lg font-medium text-[#2C3E50]">{message}</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#1ABC9C] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1 h-1 bg-[#1ABC9C] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1 h-1 bg-[#1ABC9C] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
