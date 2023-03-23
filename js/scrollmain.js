(()=>{
    let yOffset = 0; //window.pageYOFFset대신 쓸 변수
    let prevScrollHeight = 0;
    let currentScene = 0; //현재 활성화된 scroll-section
    let enterNewScene = false; //새로운 scene이 시작된 순간 true

    const sceneInfo = [
        {   //0
            type: 'sticky',
            heightNum:5, //브라우저 창사이즈의 5배로 하겠다
            scrollHeight: 0,
            objs: {
                container:document.querySelector('#scroll-section-0'),
                boll1:document.querySelector('.boll.layer1'),
                boll2:document.querySelector('.boll.layer2'),
                boll3:document.querySelector('.boll.layer3'),
                messageL: document.querySelector('#scroll-section-0 .main-message.left'),
                messageR: document.querySelector('#scroll-section-0 .main-message.right')
            },
            values:{
                messageL_opacity_in:[0, 1, {start:0.1, end:0.3}],
                messageL_translate_in:[-100, 0, {start:0.1, end:0.4}],
                messageR_opacity_in:[0, 1, {start:0.1, end:0.3}],
                messageR_translate_in:[100, 0, {start:0.1, end:0.4}],
                boll1_skew_in:[0, -40, {start:0.2, end:0.3}],
                boll2_skew_in:[0, -40, {start:0.2, end:0.3}],
                boll3_skew_in:[0, -40, {start:0.2, end:0.3}],
                boll1_translateY_in:[-50, -10, {start:0.3, end:0.5}],
                boll3_translateY_in:[-50, -90, {start:0.3, end:0.5}],
                boll1_translateX_in:[-50, -57, {start:0.3, end:0.5}],
                boll2_translateX_in:[-50, -91, {start:0.3, end:0.5}],
                boll3_translateX_in:[-50, -125, {start:0.3, end:0.5}],
            }
        }
    ];

    function setLayout(){
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i<sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; // 섹션 담아둔 배열의[i]번째.의 스크롤 하이트 요소를 5*윈도우 창 세로사이즈로 하겠다.
            }else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`; //해당 수치로 스타일 변경
        }

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++){
            totalScrollHeight +=sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id',`show-scroll-section-${currentScene}`);
    }

    function calcValues(values,currentYOffset){ //섹션별 분기를 나눠서 배열상의 값을 참고해 필요한 style값을 계산해주는 함수
        let rv; //이 함수에서 결과를 담는 용도로 사용될 변수
        const scrollHeight = sceneInfo[currentScene].scrollHeight; //섹션 세로크기(currentScene은 아래에서 for문으로 계속 값이 바뀌고있음)
        const scrollRatio = currentYOffset / scrollHeight; //현재 섹션에서 스크롤된 범위를 비율로 구하기 (스크롤탑값 / 섹션 세로 길이)

        if(values.length === 3){
            //start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight; //파트 스크롤 스타트 = 배열안의 스타트값 * 해당 섹션 세로길이
            const partScrollEnd = values[2].end * scrollHeight; // 파트 스크롤 앤드 = 배열안의 앤드값 * 해당 섹션 세로길이
            const partScrollHeight = partScrollEnd - partScrollStart; // 재생될 구간의 길이

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){ //현재 스크롤탑이 스크롤 스타트값 이상이고, 스크롤 앤드값 이하일때 
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
                // {(현재 스크롤탑 - 스크롤 스타트 = 현재 섹션에서 스크롤된 만큼의 범위) / 재생될 구간의 길이} = 애니메이션 재생될 섹션내 비율 * (밸류값)
            }else if(currentYOffset < partScrollStart){ //스크롤탑이 스타트 지점보다 위에있으면
                rv = values[0]; //밸류 첫번째값
            }else if(currentYOffset > partScrollEnd){ //스크롤탑이 앤드 지점보다 뒤에있으면
                rv = values[1]; //밸류 두번째 값
            }

        }else{
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        
        return rv;
    }

    function playAnimation(){
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight; //해당 섹션 내에서의 스크롤탑 값
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset /  scrollHeight // 전체 문서의 스크롤탑 - 이전 섹션 세로값총합 / 현재 섹션의 세로값;

        switch(currentScene) {
            case 0: 
            if(scrollRatio <= 0.8){            
                objs.messageL.style.opacity = calcValues(values.messageL_opacity_in, currentYOffset); //여기서 함수 불러와서 매개변수 꽂아넣고 있음. (return으로 rv값이 나감)
                objs.messageL.style.transform = `translate3d(${calcValues(values.messageL_translate_in, currentYOffset)}%,0,0)`;
                objs.messageR.style.opacity = calcValues(values.messageR_opacity_in, currentYOffset);
                objs.messageR.style.transform = `translate3d(${calcValues(values.messageR_translate_in, currentYOffset)}%,0,0)`;
                objs.boll1.style.transform = `skew(${calcValues(values.boll1_skew_in, currentYOffset)}deg) translate3d(${calcValues(values.boll1_translateX_in, currentYOffset)}%,${calcValues(values.boll1_translateY_in, currentYOffset)}%,0)`;
                objs.boll2.style.transform = `skew(${calcValues(values.boll2_skew_in, currentYOffset)}deg)  translate3d(${calcValues(values.boll2_translateX_in, currentYOffset)}%,-50%,0)`;
                objs.boll3.style.transform = `skew(${calcValues(values.boll3_skew_in, currentYOffset)}deg) translate3d(${calcValues(values.boll3_translateX_in, currentYOffset)}%,${calcValues(values.boll3_translateY_in, currentYOffset)}%,0)`;
            }
                break;
            }
    }

    function scrollLoop(){
        prevScrollHeight = 0;
        enterNewScene = false;
        for(let i = 0; i < currentScene; i++){
            //prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
            prevScrollHeight += sceneInfo[i].scrollHeight; // 이전 스크롤 하이트(라는 변수) 에 섹션 i번째의 세로크기값을 더해라 (를 currentScene 수치만큼 반복)
        }
        if(yOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            document.body.classList.remove('scroll-effect-end');
        }

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // 현재 페이지 스크롤탑 값이 이전 스크롤 하이트 + 현재스크롤 하이트 보다 크면 
            enterNewScene = true;
            if(currentScene === sceneInfo.length - 1){
                document.body.classList.add('scroll-effect-end');
            }
            if(currentScene < sceneInfo.length - 1){
                currentScene++; //1씩 늘려라
            }
            document.body.setAttribute('id',`show-scroll-section-${currentScene}`);
        }
        if(yOffset < prevScrollHeight){ //현재 페이지 스크롤탑 값이 이전 스크롤 하이트 값보다 작으면
            enterNewScene = true;
            if(currentScene === 0) return; // 브라우저 바운스 효과로 마이너스값이 되는 것을 방지
            currentScene--; //1씩 빼라
            document.body.setAttribute('id',`show-scroll-section-${currentScene}`);
        }

        if(enterNewScene == false){
            playAnimation();
        } 
    }

    window.addEventListener('load',()=>{
        setLayout();

        let tempYOffset = window.pageYOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        };

        window.addEventListener('resize', ()=>{
            if(window.innerWidth > 900){
                window.location.reload();
            }
        });

        window.addEventListener('orientationchange',() => {
            setTimeout(() => {
                window.location.reload();
            }, 200);
        });
        

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset; //pageYOffset은 IE환경 고려하여 사용 고려 안한다면 scrollY으로 대체 가능하다고...
            scrollLoop(); //스크롤시 스크롤 루프 함수 실행
    
            function loop() {
                delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
    
                if(!enterNewScene){
                    if(currentScene === 0 ){
                        const currentYOffset = delayedYOffset - prevScrollHeight; //부드럽게 처리하기 위해서 delayedYOffset사용
                        const objs = sceneInfo[currentScene].objs;
                        const values = sceneInfo[currentScene].values;
                        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
    
                        if(objs.videoImages[sequence]){
                            objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                        }
                    }
                }
    
                rafId = requestAnimationFrame(loop);
    
                if (Math.abs(yOffset - delayedYOffset) < 1) {
                    cancelAnimationFrame(rafId);
                    rafState = false;
                }
            }
    
        });


    }); //모든 리소스까지 로드 되어야 이벤트 애드

    document.querySelector('.loading').addEventListener('transitionend',(e) =>{
        document.body.removeChild(e.currentTarget);
    });


}) (); //아니 호출을 해야지 일을 하지 () 써라.