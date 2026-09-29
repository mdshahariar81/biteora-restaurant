export default function AppDownload() {
  return (
    <section
      id="app"
      className="px-5 py-10 sm:px-8 lg:px-10"
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1200px]
          flex-col
          overflow-hidden
          rounded-3xl
          bg-[var(--color-primary)]
          sm:flex-row
          sm:items-center
          animate-[appSectionIn_0.7s_ease-out_both]
        "
      >
        {/* =====================================================
            LEFT SIDE — APP DOWNLOAD CONTENT
        ===================================================== */}
        <div
          className="
            relative
            z-10
            px-6
            py-10
            sm:w-1/2
            sm:px-10
            lg:px-12
            lg:py-12
          "
        >
          {/* Small section label */}
          <p
            className="
              mb-2
              text-[12px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-white/80
              animate-[appTextIn_0.6s_ease-out_both]
            "
            style={{ animationDelay: "0.05s" }}
          >
            Download Our App
          </p>

          {/* Main heading */}
          <h2
            className="
              max-w-[420px]
              text-3xl
              font-extrabold
              leading-tight
              tracking-tight
              text-white
              sm:text-4xl
              animate-[appTextIn_0.7s_ease-out_both]
            "
            style={{ animationDelay: "0.12s" }}
          >
            Great Food.
            <br />
            Better Experience.
          </h2>

          {/* Description */}
          <p
            className="
              mt-4
              max-w-[430px]
              text-sm
              leading-6
              text-white/80
              animate-[appTextIn_0.7s_ease-out_both]
            "
            style={{ animationDelay: "0.2s" }}
          >
            Order faster, get exclusive offers and enjoy a better
            restaurant experience right from your phone.
          </p>

          {/* =================================================
              APP STORE BUTTONS
          ================================================= */}
          <div
            className="
              mt-6 flex flex-wrap gap-3
              animate-[appButtonsIn_0.7s_ease-out_both]
            "
            style={{ animationDelay: "0.28s" }}
          >

            {/* =================================================
                APP STORE
            ================================================= */}
            <a
              href="#"
              aria-label="Download on the App Store"
              className="
                group
                flex
                items-center
                gap-2
                rounded-xl
                bg-black
                px-4
                py-2.5
                text-left
                !text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:scale-[1.02]
                hover:bg-neutral-900
                hover:shadow-lg
                active:scale-[0.98]
              "
            >
              {/* Apple Icon */}
              <svg
                viewBox="0 0 24 24"
                className="
                  h-6 w-6 shrink-0
                  !fill-white
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
                aria-hidden="true"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25C11.88 5.02 13.69 3.18 15.75 3c.29 2.58-2.34 4.5-3.72 4.25Z" />
              </svg>

              {/* App Store Text */}
              <span className="leading-tight !text-white">
                <span
                  className="
                    block
                    text-[8px]
                    uppercase
                    tracking-wide
                    !text-white/70
                  "
                >
                  Download on the
                </span>

                <span
                  className="
                    block
                    text-sm
                    font-semibold
                    !text-white
                  "
                >
                  App Store
                </span>
              </span>
            </a>

            {/* =================================================
                GOOGLE PLAY
            ================================================= */}
            <a
              href="#"
              aria-label="Get it on Google Play"
              className="
                group
                flex
                items-center
                gap-2
                rounded-xl
                bg-black
                px-4
                py-2.5
                text-left
                !text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:scale-[1.02]
                hover:bg-neutral-900
                hover:shadow-lg
                active:scale-[0.98]
              "
            >
              {/* Google Play Icon */}
              <svg
                viewBox="0 0 24 24"
                className="
                  h-6 w-6 shrink-0
                  !fill-white
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
                aria-hidden="true"
              >
                <path d="M3.5 2.9c-.32.34-.5.86-.5 1.54v15.12c0 .68.18 1.2.5 1.54L3.58 21 13.03 11.5v-.22L3.58 1.78l-.08.12Zm12.9 10.8-3.1-3.1v-.22l3.1-3.1.07.04 3.68 2.09c1.05.6 1.05 1.57 0 2.17l-3.68 2.09-.07.03ZM4.17 1.51 13.62 11 4.17 20.49l8.75-8.75L4.17 1.51ZM13.62 13l-8.75 8.49 10.64-6.05L13.62 13Z" />
              </svg>

              {/* Google Play Text */}
              <span className="leading-tight !text-white">
                <span
                  className="
                    block
                    text-[8px]
                    uppercase
                    tracking-wide
                    !text-white/70
                  "
                >
                  Get it on
                </span>

                <span
                  className="
                    block
                    text-sm
                    font-semibold
                    !text-white
                  "
                >
                  Google Play
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE — PROMOTIONAL IMAGE
        ===================================================== */}
        <div
          className="
            relative
            flex
            min-h-[260px]
            flex-1
            items-end
            justify-center
            overflow-hidden
            sm:min-h-[300px]
            animate-[appImageIn_0.9s_ease-out_both]
          "
          style={{ animationDelay: "0.15s" }}
        >
          <img
            src="/images/app/app-promo.png"
            alt="Biteora restaurant mobile application"
            loading="eager"
            fetchPriority="high"
            className="
              h-auto
              w-full
              max-w-[620px]
              object-contain
              object-bottom
              transition-transform
              duration-700
              hover:scale-[1.02]
            "
          />
        </div>
      </div>
    </section>
  );
}