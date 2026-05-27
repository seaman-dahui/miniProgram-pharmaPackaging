/** 预览图片（微信小程序隐藏保存/转发菜单） */
export function previewImages(urls: string[], current?: string) {
  if (!urls.length) return;
  uni.previewImage({
    urls,
    current: current ?? urls[0],
    showmenu: false,
  });
}
