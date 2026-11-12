
const head = document.getElementById("head");
const pet = document.getElementById("mengli");
const leftarm = document.getElementById("leftarm");
const rightarm = document.getElementById("rightarm");

let isDragging = false;
let dragPart = null;

let offsetX = 0;
let offsetY = 0;

let startAngle = 0;
let startRotation = 0;
let reach = 0;

// ===== 点击歪头 =====

head.addEventListener("click", function() {
    head.classList.toggle("tilt");
});

// ===== 计算肩关节与鼠标的关系 =====

function getVector(e, arm) {

    const joint = arm.querySelector(".joint");
    const rect = joint.getBoundingClientRect();

    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    return {
        dx: dx,
        dy: dy,
        angle: Math.atan2(dy, dx) * 180 / Math.PI,
        distance: Math.hypot(dx, dy)
    };
}

// ===== 按下鼠标 =====

pet.addEventListener("pointerdown", function(e) {

    if (isDragging || e.button !== 0) return;

    // 判断抓住哪个部位
    if (e.target.closest("#leftforearm")) {
        dragPart = "left";
    } else if (e.target.closest("#rightforearm")) {
        dragPart = "right";
    } else if (e.target.closest("#body-hit")) {
        dragPart = "body";
    } else {
        return;
    }

    e.preventDefault();

    isDragging = true;
    pet.classList.add("dragging");

    // 固定当前身体位置
    const x = pet.offsetLeft;
    const y = pet.offsetTop;

    pet.style.position = "fixed";
    pet.style.left = x + "px";
    pet.style.top = y + "px";

    // 抓住身体
    if (dragPart === "body") {

        offsetX = e.clientX - x;
        offsetY = e.clientY - y;

    } else {

        // 判断抓住哪条手臂
        const arm = dragPart === "left"
            ? leftarm
            : rightarm;

        const vector = getVector(e, arm);

        startAngle = vector.angle;

        startRotation = dragPart === "left"
            ? 33
            : 279;

        // 记录抓取点距离肩膀的长度
        reach = Math.max(vector.distance, 1);
    }

    pet.setPointerCapture(e.pointerId);

    console.log(dragPart);
});

// ===== 牵手系统 =====

function followHand(e, arm) {

    const vector = getVector(e, arm);

    // 计算手臂旋转角度
    const rotation =
        startRotation + vector.angle - startAngle;

    arm.style.transform = `rotate(${rotation}deg)`;

    // 如果拉动距离超过手臂长度
    if (vector.distance > reach) {

        const extra = vector.distance - reach;

        const moveX =
            vector.dx / vector.distance * extra;

        const moveY =
            vector.dy / vector.distance * extra;

        // 移动整个梦璃
        pet.style.left =
            (parseFloat(pet.style.left) + moveX) + "px";

        pet.style.top =
            (parseFloat(pet.style.top) + moveY) + "px";
    }
}

// ===== 移动鼠标 =====

pet.addEventListener("pointermove", function(e) {

    if (!isDragging) return;

    if (dragPart === "body") {

        pet.style.left =
            (e.clientX - offsetX) + "px";

        pet.style.top =
            (e.clientY - offsetY) + "px";

    } else if (dragPart === "left") {

        followHand(e, leftarm);

    } else if (dragPart === "right") {

        followHand(e, rightarm);

    }
});

// ===== 结束拖动 =====

function stopDragging() {

    if (!isDragging) return;

    isDragging = false;
    dragPart = null;

    // 恢复手臂初始姿势
    leftarm.style.transform = "";
    rightarm.style.transform = "";

    // 恢复呼吸动画
    pet.classList.remove("dragging");
}

pet.addEventListener("pointerup", stopDragging);
pet.addEventListener("pointercancel", stopDragging);
pet.addEventListener("lostpointercapture", stopDragging);
