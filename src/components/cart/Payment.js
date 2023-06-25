import { useTranslation } from "@/app/i18n/client";
import { useState } from "react";


export default function Payment({  lng, handleCancel, handlePay, orderId,  orderAmount}) {
    const [showError, setShowError] = useState(false);
    const { t } = useTranslation(lng, "common");
    return (
        <div className="flex-col">
        <span className="text-xl mb-4">
            Scan to pay
        </span>
        <img src={`https://api.vietqr.io/image/970415-100879113533-uKJAdJQ.jpg?accountName=TRINH%20THU%20HAI&amount=1000&addInfo=PAY%20ORDER%20CAFETERIA${orderId}`} className="w-60 h-auto mb-4" />
        
        <div className="flex justify-around">
        <div className="flex w-5/12 bottom-[90px] md:bottom-[20px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#F59191] md:rounded-md clickable">
        <span className="w-full text-center text-l" onClick={handleCancel}>
            {t("Cancel")}
          </span>
        </div>
        <div className="flex w-5/12 bottom-[90px] md:bottom-[20px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-[#A3DE69] md:rounded-md clickable">
        <span className="w-full text-center text-l" onClick={async () => {

            let result =  await handlePay();
            if(result){
                console.log("result: ", result);
                if (result?.err){
                    setShowError(true);
                }
            }
        }}>
            {t("I've paid")}
        </span>
        </div>
        </div>
        <div className="flex">
            <span className="w-full text-l text-red-600 text-center">
                {showError && t("Please pay the exact amount!")}
            </span>
        </div>
        </div>
    );
}