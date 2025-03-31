importClass(android.content.Context);
importClass(android.widget.Toast);
importClass(android.graphics.drawable.GradientDrawable);


var Toast = new android.widget.Toast(context);
Toast.setDuration(1);
var textview = new android.widget.TextView(context);
textview.setGravity(android.view.Gravity.CENTER);
textview.setBackgroundResource(R.drawable.layer_textview);
textview.setPadding(30, 15, 30, 15);

function setBackgroundRoundRounded(view, color) {
    let gradientDrawable = new GradientDrawable();
    gradientDrawable.setShape(GradientDrawable.RECTANGLE);
    gradientDrawable.setColor(color);
    gradientDrawable.setCornerRadius(20);
    view.setBackgroundDrawable(gradientDrawable);
}

// custom-toast.js

/**
 * 显示自定义 Toast
 * @param {string} message 要显示的提示信息
 * @param {number} duration Toast 显示时长 (android.widget.Toast.LENGTH_SHORT 或 android.widget.Toast.LENGTH_LONG)
 */
function show(message, duration = android.widget.Toast.LENGTH_SHORT) {
    ui.run(() => {

        textview.setText(message);
        textview.setTextColor(colors.rgb(255, 255, 255));
        if (duration) {
            Toast.setDuration(duration)
        }

        setBackgroundRoundRounded(textview, colors.parseColor("#02685B"));

        Toast.setView(textview);
        Toast.show();

    });
}

// 导出 show 函数，以便在其他脚本中调用
module.exports = {
    show: show,
    LENGTH_SHORT: android.widget.Toast.LENGTH_SHORT,
    LENGTH_LONG: android.widget.Toast.LENGTH_LONG
};