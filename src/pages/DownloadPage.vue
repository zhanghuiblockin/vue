<!--下载页-->
<template>
  <div class="wrap" style="height:100%">
    <div v-title class="hide-title">{{ $t('download.title') }}</div>

    <div class="box mt50 mb50">
      <div class="download-page f-cb">
        <img class="l" src="../assets/img/down-page/phone.png" alt="">
        <div class="r">
          <h2>{{ $t('download.title') }}<span>{{ $t('download.sub-title') }}</span></h2>
          <div class="f-cb mt60">
            <div class="btns">
              <a href='#'><span class="iconfont icon-ios"></span> {{ $t('download.ios-download') }}</a>
              <a href='#'><span class="iconfont icon-android"></span> {{ $t('download.android-download') }}</a>
            </div>
            <div class="qrcode"><img src="../assets/img/down-page/qrcode.jpg" alt=""></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DownloadPage"
};
</script>
