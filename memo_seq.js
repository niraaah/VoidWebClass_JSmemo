import readlineSyncModule from "readline-sync";
import fileSystem from 'fs';

function fileExists(path) { 
    // memo.json의 존재 여부 판정
    try {
        return fileSystem.existsSync(path);
    } catch (err) {
        return false;
    }
}

function saveJson(memoList, menu){ 
    // memoList 리스트를 memo.json에 저장
    fileSystem.writeFileSync(
        `memo.json`,
        JSON.stringify(memoList),
        'utf8'
    )
    console.log(`!! ${menu}되었습니다`)
}

function loadJson(){ 
    // memo.json을 memoList 리스트로 읽어오기
    const tmpMemoJson = fileSystem.readFileSync('./memo.json', 'utf8')
    const memoList = JSON.parse(tmpMemoJson)
    return memoList
}

function writeMemo(){ 
    // 메모의 title과 content를 입력받아
    // 하나의 json 형식의 문자열로 만들어 반환
    console.log("!! \'!end\'를 입력하면 작성이 왼료됩니다")
    const title = readlineSyncModule.question("제목 >> ")
    if(title === "!end"){
        console.log("!! 작성을 취소합니다")
        return -1
    }
    let content = ""
    let index = 1
    while(true){
        const tmp = readlineSyncModule.question(`${index}번째 줄의 내용 >>`)
        if(tmp === "!end"){
            // 처음과 끝에 붙은 공백 문자들을 제거
            content = content.trim()
            // title도 비어있고 content도 비어있는 데이터는 저장되지 않도록
            if(title === "" && content === ""){
                console.log("!! 작성을 취소합니다")
                return -1
            }
            const newJson = {"title": title, "content": content}
            return newJson
        }
        content = content + tmp + "\n\t  "
        index ++
    }

}

function searchMemo(memoList, menu){
    // 메모의 제목과 내용을 조회
    if(memoList.length === 0){
        // memoList가 비어있을 경우에 대한 예외처리
        console.log(`!! ${menu}할 항목이 없습니다.`)
        return -1
    }
    for(let i = 0; i < memoList.length; i++){
        console.log(`[${i + 1}] 제목: ${memoList[i].title}`)
        console.log(`--- 내용: ${memoList[i].content}`)
    }
    return 0
}

function selectMemo(memoList, menu){
    let memoNum = parseInt(readlineSyncModule.question(`?? ${menu}하고자 하는 메모의 번호를 입력하세요 >> `), 10)
    if(memoNum <= 0 || memoNum  >= memoList.length + 1){
        // 인덱스를 넘어가는 번호가 입력되었을 경우 예외처리
        console.log("!! 잘못된 입력입니다.")
        console.log("!! 메인 메뉴로 돌아갑니다.")
        return -1
    }
    return memoNum - 1
}

function run(){
    // -- 프로그램의 시작 --
    let title = "", content = ""
    let memoList = []

    // memo.json이 없을때 - 빈 문자열을 memo.json으로 저장하는 방식으로 파일 생성
    if (fileExists('./memo.json') === false){ saveJson(memoList) }

    console.log("< 메모장 >")
    while(true){
        console.log()
        console.log("1. 작성 2. 조회 3. 수정 4. 삭제 5. 추가기능 6. 종료")
        const selectMenu = parseInt(readlineSyncModule.question("?? 메뉴 선택 >> "))
        switch(selectMenu){
            case 1: // 사용자가 "작성"을 선택했을 때
                let memoList_W = loadJson()  
                let newJson_W = writeMemo()
                if(newJson_W === -1){
                    // 작성이 취소된 경우 switch-case문을 탈출
                    break
                }
                memoList_W.push(newJson_W)
                saveJson(memoList_W, "새로운 메모가 저장")
                break
            case 2: // 사용자가 "조회"를 선택했을 때
                let memoList_S = loadJson()
                searchMemo(memoList_S, "조회")
                break
            case 3: // 사용자가 "수정"을 선택했을 때
                let memoList_R = loadJson()
                let flag_R = searchMemo(memoList_R, "수정")
                if (flag_R === -1){
                    // memoList가 비어있는 경우 예외처리
                    flag_R = 1 // flag 초기화
                    break
                }
                let memoNum_R = selectMemo(memoList_R, "수정")
                if(memoNum_R === -1){
                    // 잘못된 숫자를 입력했을 경우  switch-case문을 탈출
                    break
                }
                let newJson_R = writeMemo()
                if(newJson_R === -1){
                    // 작성이 취소된 경우 switch-case문을 탈출
                    break
                }
                // memoList에서 사용자가 요청한 하나의 메모 수정
                memoList_R.splice(memoNum_R, 1, newJson_R)
                saveJson(memoList_R, "해당 메모가 수정")
                break
            case 4: // 사용자가 "삭제"를 선택했을 때
                let memoList_D = loadJson()
                let flag_D = searchMemo(memoList_D, "삭제")
                if (flag_D === -1){
                    // memoList가 비어있는 경우 예외처리
                    flag_D = 1 // flag 초기화
                    break
                }
                let memoNum_D = selectMemo(memoList_D, "삭제")
                if(memoNum_D === -1){
                    // 잘못된 숫자를 입력했을 경우  switch-case문을 탈출
                    break
                }
                // memoList에서 사용자가 요청한 하나의 메모 제거
                memoList_D.splice(memoNum_D, 1) 
                saveJson(memoList_D, "해당 메모가 삭제")
                break
            case 5:
                console.log("!! 구현 예정입니다.")
                break
            case 6: // 사용자가 "종료"를 선택했을 때
                console.log("!! 종료합니다.")
                process.exit(1)
            default:
                console.log("!! 올바른 메뉴를 입력해주세요")
                break
        }
    }
}

run()