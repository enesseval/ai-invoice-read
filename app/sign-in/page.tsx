import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

function SignIn() {
   return (
      <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-2 py-5 lg:py-10 h-screen w-11/12 mx-auto">
         <div className="w-full flex items-center row-span-3 lg:row-span-4 order-2 lg:order-1">
            <div className="w-full h-full mx-auto lg:mr-auto">
               <div className="w-full px-2 lg:px-6 flex flex-col space-y-5 my-5 lg:my-20">
                  <Image src={"/chorifyx-logo.png"} alt="chorifyx-logo" width={200} height={100} />

                  <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold font-space-grotesk text-slate-600">Faturalarınızı Yapay Zeka ile Analiz Edin</h2>
                  <p className="font-space-grotesk text-slate-600">
                     Faturalarınızı yükleyin, kategorize edin ve finansal verilerinizi anında analiz edin. Yapay zeka destekli sistemimiz ile fatura yönetimi artık çok daha kolay.
                  </p>
               </div>
            </div>
         </div>
         <div className="w-full flex items-center row-span-1 lg:row-span-4 order-1 lg:order-2">
            <div className="w-full h-full mx-auto lg:ml-auto relative rounded-4xl">
               <Image src={"/login-image.png"} alt="login-image" fill className="object-cover rounded-4xl" />
            </div>
         </div>
      </div>
   );
}

export default SignIn;
