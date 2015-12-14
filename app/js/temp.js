
  app.acquire(app.urls.homeModule,'GET',"请求特卖首页特卖模块",{},function(data){
    var totalWine = 0,
    screenWidth = app.screenSize(),
    imgWidth = liWidth = screenWidth * 0.425,
    ratio = 0.6,
    imgHeight = imgWidth / 0.75,
    bottomHeight = 50,
    liHeight = imgHeight + bottomHeight;
        //console.log("screenWidth: " + screenWidth + " imgWidth: " + imgWidth)

        var moduleArr = data.specialSellModule,
        parent = $('.home-special-sell-wrap') //特卖模块包裹层
        for (var i = 0; i < moduleArr.length; i++) {

          var currentModule = moduleArr[i],
          wineArr = currentModule['exampleList'];

          var $moduleItem = $("<div class='module-item'></div>"),
          $moduleBar = $("<div class='module-bar'></div>"),
          $a = $("<a class='module-clicked' href='list.html?id="+currentModule['id']+"'data-moduleId ='"+currentModule['id']+"'></a>"),
          $img = $("<img src='"+currentModule['modulImgLink']+"'>"),
          $moduleName = $("<span>"+currentModule['moduleName']+"</span>"),
          $checkOut = $("<span>查看全部 >></span>");

          $a.append($img)
          $a.append($moduleName)
          $a.append($checkOut)
          $moduleBar.append($a)
          
          var $moduleListWrap = $("<div class='module-list-wrap'></div>")

          $ul = $("<ul></ul>")

          for (var j = 0; j < wineArr.length; j++) {
            var currentWine = wineArr[j];
            ++ totalWine

            $li = $("<li></li>")

                $wineWrap = $("<div class='wine-wrap'></div>") //包住酒款
                $wineWrap.css('width', liWidth);

                $divUp = $("<div class='div-up'></div>") //酒款上部
                $divBottom = $("<div class='div-bottom'></div>") //酒款下部

                $awinePic = $("<a class='wine-detail'></a>")
                $spanMailInfo = $("<span class='mail-info'>"+currentWine['mailInfo']+"</span>") //满200包邮 => 酒款上部
                $spanCntInfo = $("<span class='cnt-info'>"+currentWine['goodsCnt']+"</span>") //仅剩6 => 酒款上部
                $img = $("<img class='wine-img' src='"+currentWine['img']+"'>") //酒款图片 => 酒款上部

                $img.css({
                  width: imgWidth,
                  height:imgHeight
                });

                $spanSubtitle = $("<span class='subtitle'>"+currentWine['subtitle']+"</span>") //副标题 => 酒款上部

                $divHeadline = $("<div>"+currentWine['headline']+"</div>") //主描述 => 酒款下部
                $spanCurrentPrice = $("<span>"+currentWine['currentPrice']+"</span>")//现价 => 酒款下部
                $spanOriginalPrice = $("<del>"+currentWine['originalPrice']+"</del>")//原价 or 其他标注 => 酒款下部
                $spanRecom = $("<span>"+currentWine['restrictCnt']+"</span>")//主描述 => 提示

                $awinePic.append($img)
                $divUp.append($awinePic)
                $divUp.append($spanMailInfo)
                $divUp.append($spanCntInfo)
                $divUp.append($spanSubtitle)


                $divBottom.append($divHeadline)
                $divBottom.append($spanCurrentPrice)
                $divBottom.append($spanOriginalPrice)
                $divBottom.append($spanRecom)

                // 设置 divUp 以及 divBottom 的高度
                $divUp.css('height', imgHeight)
                $divBottom.css('height', bottomHeight)
                $awinePic.css('height', imgHeight)

                $wineWrap.append($divUp)
                $wineWrap.append($divBottom)
                $li.append($wineWrap)

                $ul.append($li)


                var y = parseInt(j / 2) * liHeight
                if (j % 2 ==0) {

                  $li.css({
                    left: '5%',
                    top:y 
                  });
                } else if (j % 2 == 1) {
                  $li.css({
                    left: '52.5%',
                    top: y
                  });
                }
                $wineWrap.css('wid', liWidth);

                // if i === 最后一行 && j === 最后一行 添加 margin
                if (i == moduleArr.length - 1 && 
                  (j == wineArr.length - 1) || 
                  (j == wineArr.length - 2)) {
                  $li.addClass('last-wine-item')
              }
            }
            $moduleListWrap.append($ul)

            var itemTop = 0
            if (i > 0) {
              var itemTop = i * 30 + Math.ceil(totalWine / 2 ) * liHeight
            //console.log("itemTop: " + itemTop + " i: " + i)
          }
          
          $moduleItem.css({
            top: itemTop,
            left: 0
          });
          $moduleItem.append($moduleBar)
          $moduleItem.append($moduleListWrap)
          parent.append($moduleItem)
        }
      });  