importClass(android.content.Context);
importClass(android.widget.Toast);

 
var Toast = new android.widget.Toast(context);
Toast.setDuration(1);
var textview = new android.widget.TextView(context);
textview.setGravity(android.view.Gravity.CENTER);

// custom-toast.js

/**
 * 显示自定义 Toast
 * @param {string} message 要显示的提示信息
 * @param {number} duration Toast 显示时长 (android.widget.Toast.LENGTH_SHORT 或 android.widget.Toast.LENGTH_LONG)
 */
function show(message, duration = android.widget.Toast.LENGTH_SHORT) {
    ui.run(() => {
     
        textview.setText(String(new Date()));
        textview.setTextColor(colors.rgb(255, 0, 0));
        textview.setBackgroundColor(反色(colors.rgb(255, 0, 0)));
        Toast.setView(textview);
        Toast.show();

    });
}
 
function 反色(color) {
    return (-1 - colors.argb(0, colors.red(color), colors.green(color), colors.blue(color)));
};
// 导出 show 函数，以便在其他脚本中调用
module.exports = {
    show: show,
    LENGTH_SHORT: android.widget.Toast.LENGTH_SHORT,
    LENGTH_LONG: android.widget.Toast.LENGTH_LONG
};