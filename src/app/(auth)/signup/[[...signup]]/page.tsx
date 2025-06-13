import { SignUp } from "@clerk/nextjs";

export default function Page(){
    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-700  shadow-lg p-6">
      <SignUp/>
      </div>
    </div>
    )
}