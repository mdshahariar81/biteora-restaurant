import Image from "next/image";

const categories = [
  {
    name: "All",
    image: "/images/categories/all.png",
  },
  {
    name: "Buckets",
    image: "/images/categories/buckets.png",
  },
  {
    name: "Burgers",
    image: "/images/categories/burgers.png",
  },
  {
    name: "Chicken",
    image: "/images/categories/chicken.png",
  },
  {
    name: "Snacks",
    image: "/images/categories/snacks.jpg",
  },
  {
    name: "Sides",
    image: "/images/categories/sides.png",
  },
  {
    name: "Drinks",
    image: "/images/categories/drinks.png",
  },
  {
    name: "Desserts",
    image: "/images/categories/desserts.png",
  },
];

export default function Categories() {
  return (
    <section className="bg-[var(--color-background)] py-8 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            CATEGORY LIST

            Horizontal scrolling on smaller screens.
            Centered layout on desktop.

            Animation:
            - Each category enters with a small stagger
            - Hover gives a subtle lift
            - Image gently scales on hover
        ===================================================== */}
        <div className="scrollbar-hide flex items-start justify-between gap-4 overflow-x-auto pb-2 sm:gap-6 lg:gap-8">

          {categories.map((category, index) => {
            const isActive = index === 0;

            return (
              <button
                key={category.name}
                type="button"
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className="
                  group flex min-w-[72px] shrink-0 flex-col items-center
                  animate-[categoryFadeUp_0.6s_ease-out_both]
                  transition-transform duration-300
                  hover:-translate-y-1
                  active:scale-[0.97]
                "
              >
                {/* Image container */}
                <div
                  className={`relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-300 sm:h-[82px] sm:w-[82px] ${
                    isActive
                      ? "border-2 border-[var(--color-primary)] shadow-sm"
                      : "border border-transparent group-hover:border-[var(--color-primary)] group-hover:shadow-sm"
                  }`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="82px"
                    className="
                      object-contain p-1.5
                      transition-transform duration-500
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Category name */}
                <span
                  className={`mt-2.5 text-[12px] font-medium transition-colors duration-300 sm:text-[13px] ${
                    isActive
                      ? "font-bold text-[var(--color-primary)]"
                      : "text-[var(--color-text)] group-hover:text-[var(--color-primary)]"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}