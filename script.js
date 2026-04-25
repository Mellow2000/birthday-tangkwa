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

  const introPopup = document.getElementById("introPopup");
  const introOkBtn = document.getElementById("introOkBtn");
  const introCancelBtn = document.getElementById("introCancelBtn");

  let isOpen = false;
  let currentIndex = 0;
  let showingA = true;
  let isAnimating = false;
  let cakeShown = false;
  let candlesBlown = false;
  let input = "";

  // 👉 swipe
  let startX = 0;
  let currentX = 0;
  let diffX = 0;
  let isDragging = false;

  const CORRECT_PASSWORD = "250444";

  const images = [
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
    "images/6.jpg"
  ];

  const messages = [
    "สุขสันต์วันเกิดนะคับ 🎂🎁",
    "ขอให้ปีนี้หรือปีถัดๆไป เป็นปีที่ดีสำหรับเธอ 🎉",
    "การงาน การเงิน ปังๆ 💪",
    "ยิ้มเยอะๆ ในทุกวัน 😊",
    "เป็นคนสดใส ร่าเริ่ง น่ารักแบบนี้ไปตลอดเลยนะ💖",
    "🫶🏻"
  ];

  // =====================
  // PRELOAD
  // =====================
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function resetClasses(el) {
    el.classList.remove("active", "stack", "entering", "leaving", "out");
  }

  function hidePolaroidPopup() {
    polaroidPopup?.classList.remove("show");
  }

  function showPolaroidPopup() {
    polaroidImg.src = "images/7.jpg";
    polaroidCaption.textContent =
      "🎂 ขอให้เป็นปีที่สดใส มีรอยยิ้มเยอะๆ เหมือนที่เธอทำให้คนรอบข้างยิ้มได้ตลอดเวลา 💖";
    polaroidPopup.classList.add("show");
  }

  function resetCandles() {
    document.querySelectorAll(".candle").forEach((candle) => {
      candle.classList.remove("off");
      candle.setAttribute("data-lit", "true");
      const flame = candle.querySelector(".flame");
      if (flame) flame.style.display = "block";
    });

    cakeNote.textContent = "อธิษฐานก่อนเป่าเทียน 🎂";
    blowBtn.classList.remove("hide");
    candlesBlown = false;
    blowBtn.textContent = "เป่าเทียน 🎂";
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

    showingA = true;
    slideshowWrap.classList.remove("hide");
    hideCakeStage();
  }

  function updateMessage(index) {
    message.style.opacity = "0";
    setTimeout(() => {
      message.textContent = messages[index];
      message.style.opacity = "1";
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

    currentImg.classList.add("leaving");
    nextImg.classList.add("entering");

    updateMessage(index);

    setTimeout(() => {
      resetClasses(currentImg);
      resetClasses(nextImg);
      nextImg.classList.add("active");

      showingA = !showingA;
      isAnimating = false;
      updateButtons();
    }, 800);
  }

  function updateButtons() {
    const disabled = currentIndex === 0 && !cakeShown;
    prevBtn.style.opacity = disabled ? "0.3" : "1";
    prevBtn.disabled = disabled;
  }

  // =====================
  // SWIPE SYSTEM (FIXED)
  // =====================

  function handleSwipeEnd() {
    const threshold = 80;

    slideshowWrap.style.transition = "transform 0.3s ease";

    if (diffX < -threshold) {
      slideshowWrap.style.transform = "translateX(-100%) rotate(-10deg)";
      setTimeout(() => {
        nextBtn.click();
        resetPosition();
      }, 200);
    } else if (diffX > threshold) {
      slideshowWrap.style.transform = "translateX(100%) rotate(10deg)";
      setTimeout(() => {
        prevBtn.click();
        resetPosition();
      }, 200);
    } else {
      resetPosition();
    }
  }

  function resetPosition() {
    slideshowWrap.style.transition = "transform 0.3s ease";
    slideshowWrap.style.transform = "translateX(0)";
    diffX = 0;
  }

  slideshowWrap.addEventListener("pointerdown", (e) => {
    if (!isOpen || isAnimating) return;

    isDragging = true;
    startX = e.clientX;
    slideshowWrap.style.transition = "none";
  });

  slideshowWrap.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    currentX = e.clientX;
    diffX = currentX - startX;

    const rotate = (diffX / 300) * 12;
    const curveY = Math.abs(diffX) * 0.15;

    slideshowWrap.style.transform = `
      translateX(${diffX}px)
      translateY(${curveY}px)
      rotate(${rotate}deg)
    `;
  });

  slideshowWrap.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipeEnd();
  });

  slideshowWrap.addEventListener("pointerleave", () => {
    isDragging = false;
    resetPosition();
  });

  // =====================
  // EVENTS
  // =====================

  btn.addEventListener("click", () => {
    if (!isOpen) {
      currentIndex = 0;
      showFirstSlide();
      cardShell.classList.add("open");
      btn.textContent = "ปิดการ์ด 🎁";
      isOpen = true;
    } else {
      cardShell.classList.remove("open");
      btn.textContent = "เปิดการ์ด 🎉";
      isOpen = false;
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!isOpen || isAnimating || cakeShown) return;

    if (currentIndex === images.length - 1) {
      showCakeStage();
      return;
    }

    currentIndex++;
    updateCardContent(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    if (!isOpen || isAnimating) return;

    if (cakeShown) {
      cakeStage.classList.remove("show");
      slideshowWrap.classList.remove("hide");
      cakeShown = false;
      return;
    }

    if (currentIndex === 0) return;

    currentIndex--;
    updateCardContent(currentIndex);
  });

blowBtn.addEventListener("click", () => {

  // 👉 ถ้าเป่าแล้ว = กดเพื่อเปิดรูป
  if (candlesBlown) {
    showPolaroidPopup();
    return;
  }

  // 👉 เป่าเทียน
  candlesBlown = true;

  document.querySelectorAll(".candle").forEach((candle, i) => {
    setTimeout(() => {
      candle.classList.add("off");
    }, i * 200);
  });

  setTimeout(() => {
    // 👇 เปลี่ยนข้อความ
    cakeNote.textContent = "สุขสันต์วันเกิดอีกครั้ง 🎉";
    message.textContent = "ขอให้ทุกวันเต็มไปด้วยรอยยิ้ม 💖";

    // 👇 🔥 เปิด popup อัตโนมัติ
    showPolaroidPopup();

    // 👇 เปลี่ยนปุ่ม (ไว้กดดูซ้ำ)
    blowBtn.textContent = "เปิดดูรูป 📸";

  }, 1200);
});

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (input.length >= 6) return;
      input += btn.dataset.num;

      pinDots.forEach((dot, i) => {
        dot.classList.toggle("active", i < input.length);
      });

    if (input.length === 6) {
      if (input === CORRECT_PASSWORD) {

        lockScreen.style.opacity = "0";
        lockScreen.style.visibility = "hidden";

        page.classList.add("show");

      } else {

        // ❌ animation error เล็กน้อย
        errorText.textContent = "วันเกิดไม่ถูกต้อง";

        pinDots.forEach(dot => dot.classList.remove("active"));

        setTimeout(() => {
          errorText.textContent = "";
          input = "";
        }, 1000);
      }
    }
    });
  });

deleteBtn?.addEventListener("click", () => {
  input = input.slice(0, -1);

  pinDots.forEach((dot, i) => {
    dot.classList.toggle("active", i < input.length);
  });
});


  polaroidClose?.addEventListener("click", hidePolaroidPopup);
  polaroidOverlay?.addEventListener("click", hidePolaroidPopup);

introOkBtn.addEventListener("click", () => {
  introPopup.classList.add("hide");

  setTimeout(() => {
    introPopup.style.display = "none";
    lockScreen.style.display = "flex";
  }, 300);
});

  introCancelBtn.addEventListener("click", () => {
    introPopup.classList.add("hide");

    setTimeout(() => {
      window.close();

      // fallback (บาง browser จะไม่ยอมปิดเอง)
      window.location.href = "about:blank";
    }, 200);
  });
});