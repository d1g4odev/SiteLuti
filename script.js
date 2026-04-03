const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealElements = document.querySelectorAll(".reveal");

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const counters = document.querySelectorAll(".count-up");

const formatValue = (value, decimals, prefix, suffix) => {
  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };

  return `${prefix}${value.toLocaleString("pt-BR", options)}${suffix}`;
};

if (!reduceMotion && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;
        const target = Number(element.dataset.target || 0);
        const decimals = Number(element.dataset.decimals || 0);
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();

        const step = (timestamp) => {
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          element.textContent = formatValue(current, decimals, prefix, suffix);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            element.textContent = formatValue(target, decimals, prefix, suffix);
          }
        };

        requestAnimationFrame(step);
        observer.unobserve(element);
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
