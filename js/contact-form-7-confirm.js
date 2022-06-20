/**
 * -----------------------------------------------
 *     contact-form-7-confirm.js
 *     
 *     auther: ottoworks
 *     update: 2022 06 15
 *     release: 2022 01 24
 *
 * 		入力項目の後に以下のタグを入れる。
 * 			<div style="display:none">[text* flag]</div>
 * 			<div class="button_area" style="display: flex;">
 * 			<div class="btn_container" id="btn_back_input"><button class="wpcf7-form-control">修正する</button></div>
 * 			<div class="btn_container"><button type="submit" class="wpcf7-form-control wpcf7-submit">送信ボタン</button></div>
 * 			</div>
 *
 * 		page-contact sample
 * 		<div data-form-step="input">
 * 		<div id="scroll-point"></div>
 * 		<div id="output"></div>
 * 		<?php the_content(); ?>
 * 		</div><!-- data-form-step -->
 * 		cf7のカスタマイズ部分全体を覆うように<div data-form-step="input">を配置しておく。
 * 			※入力シーンではinput,確認シーンではconfirmになるので、スタイルアテなどで使用。
 *
 * 	-----------------------------------------------
 *
 */

//ボタンの文言
const textToConfirm = "確認画面へ進む";
const textToSubmit = "この内容で送信する";
const textToBack = "戻って修正する";

//outputする文言
const textOutputConfirm = "入力内容をご確認の上、送信してください。";
const textOutputError = "入力内容に誤りがあります。"

//サンクスページへの相対パス
const slugThanksPage = "thanks/";

//function
function scrollupToPoint(){
	let scrollPoint = document.getElementById("scroll-point");
	let position = scrollPoint.getBoundingClientRect().top + scrollY;
	window.scrollTo({
		top: position,
		behavior: "smooth",
	});
}

window.addEventListener("DOMContentLoaded", function () {
	let flag = document.querySelector("input[name=flag]");
	let btnSubmit = document.querySelector(".wpcf7-submit");
	let btnBack = document.getElementById("btn_back_input");
	let step = document.querySelector("[data-form-step]");
	let output = document.getElementById("output");

	//入力ステップ
	btnSubmit.innerText = textToConfirm;

	window.addEventListener("wpcf7submit", function (e) {
		switch (e.detail.status) {
			case "validation_failed":
				var error_count = e.detail.apiResponse.invalid_fields.length;
				if (flag.value == "" && error_count == 1) {
					//バリデーション問題なしなので確認画面への動作
					step.setAttribute("data-form-step", "confirm");
					output.innerText = textOutputConfirm;
					btnSubmit.innerText = textToSubmit;
					flag.value = "send";
					scrollupToPoint();

					btnBack.addEventListener("click", function (e) {
						e.preventDefault();
						step.setAttribute("data-form-step", "input");
						output.innerText = "";
						btnSubmit.innerText = textToConfirm;
						flag.value = "";
						scrollupToPoint();
					});
				}else{
					//バリデーションエラーの場合
					output.innerText = textOutputError;
					scrollupToPoint();
				}
				break;
			case "mail_sent":
				location.href = location.href + slugThanksPage;
				break;
		}
	});
});

//エンターキーでのsubmitを無効にする。
function submitStop(e){
  if (!e) var e = window.event;
  if(e.keyCode == 13)
  return false;
}
window.onload = function (){
  var list = document.getElementsByTagName("input");
  for(var i=0; i<list.length; i++){
    if(list[i].type == 'email' || list[i].type == 'password'|| list[i].type == 'text'|| list[i].type == 'number'){
      list[i].onkeypress = function (event){
        return submitStop(event);
      };
    }
  }
}


