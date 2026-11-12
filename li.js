const head = document.getElementById("head");
const pet = document.getElementById("mengli");

let isDragging = false;
let dragPart = null;

let offsetX = 0;
let offsetY = 0;
const leftarm = document.getElementById("leftarm");
const rightarm = document.getElementById("rightarm");

let startAngle = 0;
let startRotation = 0;

//点击歪头
head.addEventListener("click", function() {
  head.classList.toggle("tilt");
});

//拖动！！！
// 按下鼠标
pet.addEventListener("pointerdown", function(e) {

    // 判断抓住的部位
    if (e.target.closest("#leftforearm")) {
        dragPart = "left";
    } else if (e.target.closest("#rightforearm")) {
        dragPart = "right";
    } else if (e.target.closest(".body")) {
        dragPart = "body";
    } else {
        return;
    }

    isDragging = true;
    pet.classList.add("dragging");

    // 如果抓住身体
    if (dragPart === "body") {

        const rect = pet.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        pet.style.position = "fixed";
        pet.style.left = rect.left + "px";
        pet.style.top = rect.top + "px";
    }

    pet.setPointerCapture(e.pointerId);

    console.log(dragPart);
});

// 移动鼠标
pet.addEventListener("pointermove", function(e) {

    if (!isDragging) return;

    if (dragPart === "body") {

        pet.style.left = (e.clientX - offsetX) + "px";
        pet.style.top = (e.clientY - offsetY) + "px";

    } else if (dragPart === "left") {

        // 以后添加左手旋转

    } else if (dragPart === "right") {

        // 以后添加右手旋转

    }
});

// 结束拖动
function stopDragging() {
    isDragging = false;
    dragPart = null;
    pet.classList.remove("dragging");
}

pet.addEventListener("pointerup", stopDragging);
pet.addEventListener("pointercancel", stopDragging);
pet.addEventListener("lostpointercapture", stopDragging);

//单独手臂拖动
function getAngle(e, arm) {
    const joint = arm.querySelector(".joint");
    const rect = joint.getBoundingClientRect();

    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    return Math.atan2(dy, dx) * 180 / Math.PI;
}
if (dragPart === "left") {
    startAngle = getAngle(e, leftarm);
    startRotation = 33;
}

if (dragPart === "right") {
    startAngle = getAngle(e, rightarm);
    startRotation = 279;
}
} else if (dragPart === "left") {

    const angle = getAngle(e, leftarm);
    leftarm.style.transform =
        `rotate(${startRotation + angle - startAngle}deg)`;

} else if (dragPart === "right") {

    const angle = getAngle(e, rightarm);
    rightarm.style.transform =
        `rotate(${startRotation + angle - startAngle}deg)`;

}
leftarm.style.transform = "";
rightarm.style.transform = "";
