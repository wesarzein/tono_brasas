
// ========== CAROUSEL ==========
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  let index = 0;
  let interval = setInterval(nextSlide, 3000);

  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === n);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === n);
    });
    document.querySelector(".slides").style.transform = `translateX(-${n * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  next.addEventListener("click", () => {
    clearInterval(interval);
    nextSlide();
    interval = setInterval(nextSlide, 3000);
  });

  prev.addEventListener("click", () => {
    clearInterval(interval);
    prevSlide();
    interval = setInterval(nextSlide, 3000);
  });

  dots.forEach(dot => {
    dot.addEventListener("click", e => {
      clearInterval(interval);
      index = parseInt(e.target.dataset.slide);
      showSlide(index);
      interval = setInterval(nextSlide, 3000);
    });
  });
});



