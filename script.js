document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btn");
  const cardShell = document.getElementById("cardShell");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const imgA = document.getElementById("imgA");
  const imgB = document.getElementById("imgB");
  const message = document.getElementById("message");
  const slideshowWrap = document.getElementById("slideshowWrap");
  const cakeStage = document.getElementById("cakeStage");
  const cakeNote = document.getElementById("cakeNote");
  const blowBtn = document.getElementById("blowBtn");

  const polaroidPopup = document.getElementById("polaroidPopup");
  const polaroidOverlay = document.getElementById("polaroidOverlay");
  const polaroidClose = document.getElementById("polaroidClose");
  const polaroidImg = document.getElementById("polaroidImg");
  const polaroidCaption = document.getElementById("polaroidCaption");

  const lockScreen = document.getElementById("lockScreen");
  const page = document.querySelector(".page");
  const buttons = document.querySelectorAll(".keypad button[data-num]");
  const deleteBtn = document.getElementById("deleteBtn");
  const pinDots = document.querySelectorAll(".pin-display span");
  const errorText = document.getElementById("errorText");

  let isOpen = false;
  let currentIndex = 0;
  let showingA = true;
  let isAnimating = false;
  let cakeShown = false;
  let candlesBlown = false;
  let input = "";

  const CORRECT_PASSWORD = "250444";

  const images = [
    "images/1.jpg",
    "images/2.JPEG",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
    "images/6.jpg"
  ];

  const messages = [
    "สุขสันต์วันเกิดนะคับ 🎂🎁",
    "ขอให้เธอได้เจอแต่สิ่งดีๆ 🎉",
    "การงาน การเงิน ปังๆ 💪",
    "ยิ้มเยอะๆ ในทุกวัน 😊",
    "เป็นคนสดใส ร่าเริ่ง น่ารักแบบนี้ไปตลอดเลยนะ💖",
    "🫶🏻"
  ];

  function resetClasses(el) {
    el.classList.remove("active", "stack", "entering", "leaving", "out");
  }

  function hidePolaroidPopup() {
    if (polaroidPopup) {
      polaroidPopup.classList.remove("show");
    }
  }

  function showPolaroidPopup() {
    if (!polaroidPopup) return;

    if (polaroidImg) {
      polaroidImg.src =
        "images/7.jpg";
    }

    if (polaroidCaption) {
      polaroidCaption.textContent =
        "🎂 ขอให้เป็นปีที่สดใส มีรอยยิ้มเยอะๆ เหมือนที่เธอทำให้คนรอบข้างยิ้มได้ตลอดเวลา 💖";
    }

    polaroidPopup.classList.add("show");
  }

  function resetCandles() {
    document.querySelectorAll(".candle").forEach((candle) => {
      candle.classList.remove("off");
      candle.setAttribute("data-lit", "true");

      const flame = candle.querySelector(".flame");
      if (flame) {
        flame.style.display = "block";
        flame.style.animation = "";
      }
    });

    cakeNote.textContent = "อธิษฐานก่อนเป่าเทียน 🎂";
    blowBtn.classList.remove("hide");
    candlesBlown = false;
  }

  function hideCakeStage() {
    cakeStage.classList.remove("show");
    cakeShown = false;
    resetCandles();
  }

  function showCakeStage() {
    slideshowWrap.classList.add("hide");

    setTimeout(() => {
      cakeStage.classList.add("show");
      cakeShown = true;
    }, 320);
  }

  function showFirstSlide() {
    imgA.src = images[0];
    imgB.src = "";

    resetClasses(imgA);
    resetClasses(imgB);

    imgA.classList.add("active");

    message.textContent = messages[0];
    message.style.opacity = "1";
    message.style.transform = "translateY(0)";

    showingA = true;
    slideshowWrap.classList.remove("hide");
    hideCakeStage();
  }

  function updateMessage(index) {
    message.style.opacity = "0";
    message.style.transform = "translateY(10px)";

    setTimeout(() => {
      message.textContent = messages[index];
      message.style.opacity = "1";
      message.style.transform = "translateY(0)";
    }, 180);
  }

  function updateCardContent(index) {
    if (isAnimating) return;
    isAnimating = true;

    const currentImg = showingA ? imgA : imgB;
    const nextImg = showingA ? imgB : imgA;

    nextImg.src = images[index];

    resetClasses(nextImg);
    resetClasses(currentImg);

    nextImg.classList.add("stack");
    void nextImg.offsetWidth;

    currentImg.classList.add("leaving");
    nextImg.classList.remove("stack");
    nextImg.classList.add("entering");

    updateMessage(index);

    setTimeout(() => {
      resetClasses(currentImg);
      currentImg.classList.add("stack");

      resetClasses(nextImg);
      nextImg.classList.add("active");

      showingA = !showingA;
      isAnimating = false;
      updateButtons()


    }, 820);
  }

  function resetAll() {
    currentIndex = 0;
    isAnimating = false;
    cakeShown = false;
    candlesBlown = false;

    imgA.src = "";
    imgB.src = "";

    resetClasses(imgA);
    resetClasses(imgB);

    message.textContent = "";
    message.style.opacity = "0";
    message.style.transform = "translateY(10px)";

    slideshowWrap.classList.remove("hide");
    cakeStage.classList.remove("show");

    resetCandles();
    hidePolaroidPopup();
  }

  function updateDots() {
    pinDots.forEach((dot, index) => {
      dot.classList.toggle("active", index < input.length);
    });
  }

  function checkPassword() {
    if (input === CORRECT_PASSWORD) {
      errorText.textContent = "";
      lockScreen.style.display = "none";

      setTimeout(() => {
        page.classList.add("show");
      }, 50);
    } else {
      errorText.textContent = "วันเกิดไม่ถูกต้องนะ ❌";
      input = "";
      updateDots();
    }
  }

  function updateButtons() {
    if (!prevBtn) return;

    const isDisabled = currentIndex === 0 && !cakeShown;

    prevBtn.style.opacity = isDisabled ? "0.3" : "1";
    prevBtn.disabled = isDisabled; // ✅ ใส่ตรงนี้
  }

  if (polaroidClose) {
    polaroidClose.addEventListener("click", hidePolaroidPopup);
  }

  if (polaroidOverlay) {
    polaroidOverlay.addEventListener("click", hidePolaroidPopup);
  }

  btn.addEventListener("click", function () {
    if (!isOpen) {
      currentIndex = 0;
      showFirstSlide();
      updateButtons();
      cardShell.classList.add("open");
      btn.textContent = "ปิดการ์ด 🎁";
      isOpen = true;
    } else {
      cardShell.classList.remove("open");
      btn.textContent = "เปิดการ์ด 🎉";
      resetAll();
      isOpen = false;
    }
  });

nextBtn.addEventListener("click", function () {
  if (!isOpen || isAnimating || cakeShown) return;

  // ถ้าอยู่รูปสุดท้ายแล้ว ให้กดอีกครั้งเพื่อไปหน้าเค้ก
  if (currentIndex === images.length - 1) {
    showCakeStage();
    return;
  }

  currentIndex += 1;
  updateCardContent(currentIndex);
  updateButtons();
});

prevBtn.addEventListener("click", function () {
  if (!isOpen || isAnimating) return;

  // ถ้าอยู่หน้าเค้ก → ย้อนกลับไป slideshow
  if (cakeShown) {
    cakeStage.classList.remove("show");

    setTimeout(() => {
      slideshowWrap.classList.remove("hide");
      cakeShown = false;
    }, 300);

    return;
  }

  // ถ้าอยู่รูปแรกแล้ว ไม่ต้องทำอะไร
  if (currentIndex === 0) return;

  currentIndex -= 1;
  updateCardContent(currentIndex);
  updateButtons();
});

  blowBtn.addEventListener("click", function () {
    if (candlesBlown) return;
    candlesBlown = true;

    const candles = document.querySelectorAll(".candle");

    candles.forEach((candle, index) => {
      setTimeout(() => {
        candle.classList.add("off");
        candle.setAttribute("data-lit", "false");

        const flame = candle.querySelector(".flame");
        if (flame) {
          flame.style.display = "none";
          flame.style.animation = "none";
        }
      }, index * 200 + Math.random() * 120);
    });

    setTimeout(() => {
      cakeNote.textContent = "สุขสันต์วันเกิดอีกครั้ง 🎉";
      message.textContent = "ขอให้ทุกวันเต็มไปด้วยรอยยิ้มและความสุข 💖";
      message.style.opacity = "1";
      message.style.transform = "translateY(0)";

      blowBtn.classList.add("hide");

      setTimeout(() => {
        showPolaroidPopup();
      }, 500);
    }, candles.length * 200 + 200);
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (input.length >= 6) return;

      input += btn.dataset.num;
      updateDots();

      if (input.length === 6) {
        checkPassword();
      }
    });
  });

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      input = input.slice(0, -1);
      updateDots();
    });
  }
});