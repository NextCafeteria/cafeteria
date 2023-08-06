import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "../app/i18n/client";
export default function MainMenu({ lng }) {
  const currentPath = usePathname();
  return (
    <>
      {currentPath.includes("/staff") || currentPath.includes("/stores") ? (
        <MainMenuStaff lng={lng} />
      ) : (
        <MainMenuUser lng={lng} />
      )}
    </>
  );
}

function MainMenuUser({ lng }) {
  const currentPath = usePathname();
  const router = useRouter();
  const { t } = useTranslation(lng, "common");
  const activeTabColor = "#111111";
  const navCss = `@media screen and (min-width: 768px) and (max-width: 1440px) {
    .nav-item span {
      font-size: min(max(13px, 1.25vw), 22px);
    }
  }`;
  return (
    <>
      <div className="nav-bar flex justify-evenly w-full fixed bottom-0 md:left-0 md:h-full md:w-auto md:flex-col h-[90px] border-t-[1px] md:border-t-0 md:border-r-[1px] rounded-t-xl md:rounded-none border-primary-500 p-2 bg-primary">
        <style>{navCss}</style>
        <div
          className={
            "nav-item flex flex-col items-center p-2 clickable text-center text-primary" +
            (currentPath === `/${lng}`
              ? " bg-[#ffffffdd] rounded-xl"
              : " bg-[#dddddd88] rounded-xl")
          }
          onClick={() => {
            router.push(`/${lng}`);
          }}
        >
          <svg
            width="23"
            height="24"
            viewBox="0 0 23 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[30px] h-[30px] grow"
          >
            <path
              d="M22.992 11.9766C22.992 12.8203 22.3931 13.4813 21.7142 13.4813H20.4365L20.4644 20.9906C20.4644 21.1172 20.4564 21.2437 20.4444 21.3703V22.125C20.4444 23.1609 19.7297 24 18.8472 24H18.2083C18.1644 24 18.1205 24 18.0766 23.9953C18.0207 24 17.9648 24 17.9089 24H16.6111H15.6528C14.7703 24 14.0556 23.1609 14.0556 22.125V21V18C14.0556 17.1703 13.4846 16.5 12.7778 16.5H10.2222C9.51545 16.5 8.94445 17.1703 8.94445 18V21V22.125C8.94445 23.1609 8.22969 24 7.34722 24H6.38889H5.11511C5.05521 24 4.99531 23.9953 4.93542 23.9906C4.8875 23.9953 4.83958 24 4.79167 24H4.15278C3.27031 24 2.55556 23.1609 2.55556 22.125V16.875C2.55556 16.8328 2.55556 16.7859 2.55955 16.7438V13.4813H1.27778C0.559028 13.4813 0 12.825 0 11.9766C0 11.5547 0.119792 11.1797 0.399306 10.8516L10.6375 0.375C10.917 0.046875 11.2365 0 11.516 0C11.7955 0 12.1149 0.09375 12.3545 0.328125L22.5528 10.8516C22.8722 11.1797 23.0319 11.5547 22.992 11.9766Z"
              fill={currentPath === `/${lng}` ? activeTabColor : "#333333"}
            />
          </svg>
          <span
            className="flex justify-center text-sm md:text-xl mt-2"
            style={{
              color: currentPath === `/${lng}` ? activeTabColor : "#333333",
            }}
          >
            {t("Home")}
          </span>
        </div>
        <div
          className={
            "nav-item flex flex-col items-center p-2 clickable text-center" +
            (currentPath === `/${lng}/orders`
              ? " bg-[#ffffffdd] rounded-xl"
              : " bg-[#dddddd88] rounded-xl")
          }
          onClick={() => {
            router.push(`/${lng}/orders`);
          }}
        >
          <svg
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[30px] h-[30px] grow"
          >
            <path
              d="M-6.125 0.0993254C-5.59375 -0.0758699 -4.96875 -0.0129793 -4.525 0.261044L-2 1.81534L0.525 0.261044C1.0875 -0.0848543 1.91875 -0.0848543 2.475 0.261044L5 1.81534L7.525 0.261044C8.0875 -0.0848543 8.91875 -0.0848543 9.475 0.261044L12 1.81534L14.525 0.261044C14.9688 -0.0129793 15.5938 -0.0758699 16.125 0.0993254C16.6562 0.274521 17 0.656357 17 1.07862V21.9224C17 22.3446 16.6562 22.7265 16.125 22.9017C15.5938 23.0769 14.9688 23.014 14.525 22.74L12 21.1857L9.475 22.74C8.9125 23.0858 8.08125 23.0858 7.525 22.74L5 21.1857L2.475 22.74C1.9125 23.0858 1.08125 23.0858 0.525 22.74L-2 21.1857L-4.525 22.74C-4.96875 23.014 -5.59375 23.0769 -6.125 22.9017C-6.65625 22.7265 -7 22.3446 -7 21.9224V1.07862C-7 0.656357 -6.65625 0.274521 -6.125 0.0993254ZM-1 6.46925C-1.55 6.46925 -2 6.79268 -2 7.188C-2 7.58331 -1.55 7.90675 -1 7.90675H11C11.55 7.90675 12 7.58331 12 7.188C12 6.79268 11.55 6.46925 11 6.46925H-1ZM-2 15.813C-2 16.2083 -1.55 16.5317 -1 16.5317H11C11.55 16.5317 12 16.2083 12 15.813C12 15.4177 11.55 15.0942 11 15.0942H-1C-1.55 15.0942 -2 15.4177 -2 15.813ZM-1 10.7817C-1.55 10.7817 -2 11.1052 -2 11.5005C-2 11.8958 -1.55 12.2192 -1 12.2192H11C11.55 12.2192 12 11.8958 12 11.5005C12 11.1052 11.55 10.7817 11 10.7817H-1Z"
              fill={
                currentPath === `/${lng}/orders` ? activeTabColor : "#333333"
              }
            />
          </svg>
          <span
            className="flex justify-center text-sm md:text-xl mt-2"
            style={{
              color:
                currentPath === `/${lng}/orders` ? activeTabColor : "#333333",
            }}
          >
            {t("Orders")}
          </span>
        </div>
        <div
          className={
            "nav-item flex flex-col items-center p-2 clickable text-center" +
            (currentPath === `/${lng}/cart`
              ? " bg-[#ffffffdd] rounded-xl"
              : " bg-[#dddddd88] rounded-xl")
          }
          onClick={() => {
            router.push(`/${lng}/cart`);
          }}
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[30px] h-[30px] grow"
          >
            <path
              d="M0 1.07812C0 0.480664 0.427257 0 0.958333 0H2.77517C3.65365 0 4.43229 0.575 4.79566 1.4375H21.2071C22.2573 1.4375 23.024 2.56055 22.7484 3.70156L21.1113 10.5432C20.7719 11.9537 19.6339 12.9375 18.3361 12.9375H6.81614L7.03177 14.2178C7.11962 14.7254 7.51493 15.0938 7.97413 15.0938H19.4861C20.0172 15.0938 20.4444 15.5744 20.4444 16.1719C20.4444 16.7693 20.0172 17.25 19.4861 17.25H7.97413C6.59253 17.25 5.4066 16.1449 5.15104 14.6221L3.09062 2.44824C3.06267 2.27754 2.9309 2.15625 2.77517 2.15625H0.958333C0.427257 2.15625 0 1.67559 0 1.07812ZM5.11111 20.8438C5.11111 20.5606 5.16069 20.2802 5.25701 20.0186C5.35333 19.757 5.49451 19.5193 5.67249 19.319C5.85047 19.1188 6.06176 18.96 6.2943 18.8516C6.52684 18.7433 6.77608 18.6875 7.02778 18.6875C7.27948 18.6875 7.52871 18.7433 7.76125 18.8516C7.99379 18.96 8.20509 19.1188 8.38307 19.319C8.56104 19.5193 8.70222 19.757 8.79855 20.0186C8.89487 20.2802 8.94444 20.5606 8.94444 20.8438C8.94444 21.1269 8.89487 21.4073 8.79855 21.6689C8.70222 21.9305 8.56104 22.1682 8.38307 22.3685C8.20509 22.5687 7.99379 22.7275 7.76125 22.8359C7.52871 22.9442 7.27948 23 7.02778 23C6.77608 23 6.52684 22.9442 6.2943 22.8359C6.06176 22.7275 5.85047 22.5687 5.67249 22.3685C5.49451 22.1682 5.35333 21.9305 5.25701 21.6689C5.16069 21.4073 5.11111 21.1269 5.11111 20.8438ZM18.5278 18.6875C19.0361 18.6875 19.5236 18.9147 19.8831 19.319C20.2425 19.7234 20.4444 20.2719 20.4444 20.8438C20.4444 21.4156 20.2425 21.9641 19.8831 22.3685C19.5236 22.7728 19.0361 23 18.5278 23C18.0194 23 17.5319 22.7728 17.1725 22.3685C16.813 21.9641 16.6111 21.4156 16.6111 20.8438C16.6111 20.2719 16.813 19.7234 17.1725 19.319C17.5319 18.9147 18.0194 18.6875 18.5278 18.6875Z"
              fill={currentPath === `/${lng}/cart` ? activeTabColor : "#333333"}
            />
          </svg>
          <span
            className="flex justify-center text-sm mt-2"
            style={{
              color:
                currentPath === `/${lng}/cart` ? activeTabColor : "#333333",
            }}
          >
            {t("Cart")}
          </span>
        </div>
        <div
          className={
            "nav-item flex flex-col items-center p-2 clickable text-center" +
            (currentPath === `/${lng}/user`
              ? " bg-[#ffffffdd] rounded-xl"
              : " bg-[#dddddd88] rounded-xl")
          }
          onClick={() => {
            router.push(`/${lng}/user`);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[30px] h-[30px] grow"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className="flex justify-center text-sm md:text-xl mt-2"
            style={{
              color:
                currentPath === `/${lng}/user` ? activeTabColor : "#333333",
            }}
          >
            {t("Menu")}
          </span>
        </div>
      </div>
    </>
  );
}

function MainMenuStaff({ lng }) {
  const currentPath = usePathname();
  const router = useRouter();
  const { t } = useTranslation(lng, "common");
  const activeTabColor = "#111111";

  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }
  if (
    session &&
    session.status === "authenticated" &&
    !session?.data?.user?.isStaff &&
    !session?.data?.user?.isAdmin
  ) {
    router.push(`/${lng}/login`);
  }

  return (
    <>
      <div className="nav-bar flex justify-evenly w-full fixed bottom-0 md:left-0 md:h-full md:w-auto md:flex-col h-[90px] border-t-[1px] md:border-t-0 md:border-r-[1px] rounded-t-xl md:rounded-none border-primary-500 p-2 bg-primary text-primary">
        <div
          className={
            "flex flex-col items-center p-2 clickable text-center" +
            (currentPath === `/${lng}`
              ? " bg-[#ffffffdd] rounded-xl"
              : " bg-[#dddddd88] rounded-xl")
          }
          onClick={() => {
            router.push(`/${lng}`);
          }}
        >
          <svg
            width="23"
            height="24"
            viewBox="0 0 23 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[30px] h-[30px] grow"
          >
            <path
              d="M22.992 11.9766C22.992 12.8203 22.3931 13.4813 21.7142 13.4813H20.4365L20.4644 20.9906C20.4644 21.1172 20.4564 21.2437 20.4444 21.3703V22.125C20.4444 23.1609 19.7297 24 18.8472 24H18.2083C18.1644 24 18.1205 24 18.0766 23.9953C18.0207 24 17.9648 24 17.9089 24H16.6111H15.6528C14.7703 24 14.0556 23.1609 14.0556 22.125V21V18C14.0556 17.1703 13.4846 16.5 12.7778 16.5H10.2222C9.51545 16.5 8.94445 17.1703 8.94445 18V21V22.125C8.94445 23.1609 8.22969 24 7.34722 24H6.38889H5.11511C5.05521 24 4.99531 23.9953 4.93542 23.9906C4.8875 23.9953 4.83958 24 4.79167 24H4.15278C3.27031 24 2.55556 23.1609 2.55556 22.125V16.875C2.55556 16.8328 2.55556 16.7859 2.55955 16.7438V13.4813H1.27778C0.559028 13.4813 0 12.825 0 11.9766C0 11.5547 0.119792 11.1797 0.399306 10.8516L10.6375 0.375C10.917 0.046875 11.2365 0 11.516 0C11.7955 0 12.1149 0.09375 12.3545 0.328125L22.5528 10.8516C22.8722 11.1797 23.0319 11.5547 22.992 11.9766Z"
              fill={currentPath === `/${lng}` ? activeTabColor : "#333333"}
            />
          </svg>
          <span
            className="flex justify-center text-sm md:text-xl mt-2"
            style={{
              color: currentPath === `/${lng}` ? activeTabColor : "#333333",
            }}
          >
            {t("Home")}
          </span>
        </div>
        <div
          className={
            "flex flex-col items-center p-2 clickable" +
            (currentPath.startsWith(`/${lng}/staffs/orders`)
              ? " bg-[#ffffff66] rounded-xl"
              : "")
          }
          onClick={() => {
            router.push(`/${lng}/staffs/orders`);
          }}
        >
          <svg
            width="17"
            height="23"
            viewBox="0 0 17 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[30px] h-[30px] grow"
          >
            <path
              d="M-6.125 0.0993254C-5.59375 -0.0758699 -4.96875 -0.0129793 -4.525 0.261044L-2 1.81534L0.525 0.261044C1.0875 -0.0848543 1.91875 -0.0848543 2.475 0.261044L5 1.81534L7.525 0.261044C8.0875 -0.0848543 8.91875 -0.0848543 9.475 0.261044L12 1.81534L14.525 0.261044C14.9688 -0.0129793 15.5938 -0.0758699 16.125 0.0993254C16.6562 0.274521 17 0.656357 17 1.07862V21.9224C17 22.3446 16.6562 22.7265 16.125 22.9017C15.5938 23.0769 14.9688 23.014 14.525 22.74L12 21.1857L9.475 22.74C8.9125 23.0858 8.08125 23.0858 7.525 22.74L5 21.1857L2.475 22.74C1.9125 23.0858 1.08125 23.0858 0.525 22.74L-2 21.1857L-4.525 22.74C-4.96875 23.014 -5.59375 23.0769 -6.125 22.9017C-6.65625 22.7265 -7 22.3446 -7 21.9224V1.07862C-7 0.656357 -6.65625 0.274521 -6.125 0.0993254ZM-1 6.46925C-1.55 6.46925 -2 6.79268 -2 7.188C-2 7.58331 -1.55 7.90675 -1 7.90675H11C11.55 7.90675 12 7.58331 12 7.188C12 6.79268 11.55 6.46925 11 6.46925H-1ZM-2 15.813C-2 16.2083 -1.55 16.5317 -1 16.5317H11C11.55 16.5317 12 16.2083 12 15.813C12 15.4177 11.55 15.0942 11 15.0942H-1C-1.55 15.0942 -2 15.4177 -2 15.813ZM-1 10.7817C-1.55 10.7817 -2 11.1052 -2 11.5005C-2 11.8958 -1.55 12.2192 -1 12.2192H11C11.55 12.2192 12 11.8958 12 11.5005C12 11.1052 11.55 10.7817 11 10.7817H-1Z"
              fill={
                currentPath.startsWith(`/${lng}/staffs/orders`)
                  ? activeTabColor
                  : "#333333"
              }
            />
          </svg>
          <span
            className="flex justify-center text-sm md:text-xl mt-2"
            style={{
              color: currentPath.startsWith(`/${lng}/staffs/orders`)
                ? activeTabColor
                : "#333333",
            }}
          >
            {t("Orders")}
          </span>
        </div>
        <div
          className={
            "flex flex-col items-center p-2 clickable text-center" +
            (currentPath === `/${lng}/user`
              ? " bg-[#ffffffdd] rounded-xl"
              : " bg-[#dddddd88] rounded-xl")
          }
          onClick={() => {
            router.push(`/${lng}/user`);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[30px] h-[30px] grow"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className="flex justify-center text-sm md:text-xl mt-2"
            style={{
              color:
                currentPath === `/${lng}/user` ? activeTabColor : "#333333",
            }}
          >
            {t("Menu")}
          </span>
        </div>
      </div>
    </>
  );
}
