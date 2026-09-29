import {
  ChefHat,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Locally sourced",
  },
  {
    icon: ChefHat,
    title: "Quality Chicken",
    description: "100% real chicken",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Hot & on time",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Safe & easy",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] rounded-2xl bg-white py-6 lg:grid-cols-4">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              className="
                group flex flex-col items-center justify-center
                px-4 text-center
                animate-[featureFadeUp_0.6s_ease-out_both]
                transition-transform duration-300
                hover:-translate-y-1
              "
            >
              {/* Feature icon */}
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full
                  text-[var(--color-text)]
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:text-[var(--color-primary)]
                "
              >
                <Icon
                  size={27}
                  strokeWidth={1.7}
                  className="
                    transition-transform duration-500
                    group-hover:rotate-3
                  "
                />
              </div>

              {/* Feature title */}
              <h3 className="mt-2 text-sm font-bold text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-primary)] sm:text-[15px]">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)] sm:text-xs">
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
}