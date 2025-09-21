export default function Page() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image/Capture7.jpg')" }} // ✅ ใส่ path ของรูป
    >
      <div className="p-6 bg-white/80 shadow-xl rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          กรุณาขอ QR Code ใหม่
        </h1>
        <p className="text-gray-700">QR Code ของคุณหมดอายุแล้ว</p>
      </div>
    </div>
  )
}
