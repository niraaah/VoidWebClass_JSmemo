import readlineSyncModule from "readline-sync";
import fileSystem from 'fs';
import CryptoJS from 'crypto-js';

function fileExists(path) { 
    // memo.json의 존재 여부 판정
    try {
        return fileSystem.existsSync(path);
    } catch (err) {
        return false;
    }
}

// 실제 비밀번호를 인자로 받아 "q1w2e3r4"로 암호화하여 json파일로 저장
function saveSecretKey(secretKey){
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(secretKey), "q1w2e3r4").toString();
    fileSystem.writeFileSync(
        `secretKey.json`,
    JSON.stringify([{"key" : `${encryptedData}`}]),
        'utf8'
    )
}

// "q1w2e3r4"로 암호화 됐던 문장을 json에서 불러와서 실제 비밀번호로 복호화하여 반환
function loadSecretKey(){
    const tmpSecretKey = fileSystem.readFileSync('./secretKey.json', 'utf8')
    const encryptedData = JSON.parse(tmpSecretKey)
    //console.log(encryptedData)
    const decryptedData = CryptoJS.AES.decrypt(encryptedData[0].key, "q1w2e3r4")
    const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8)
    const secretKey = decryptedText.substring(1, decryptedText.length - 1)
    //console.log(secretKey)
    return secretKey
}

function saveJson(memoList, secretKey, menu){ 
    //ㄱ memoList 리스트를 memo.json에 저장
    //console.log(memoList)
    const stringifyMemoList = JSON.stringify(memoList)
    let encryptedData = CryptoJS.AES.encrypt(stringifyMemoList, secretKey).toString();
    //console.log(encryptedData)
    const encryptedString = `[{"encrypted" : "${encryptedData}"}]`
    fileSystem.writeFileSync(
        `memo.json`,
        encryptedString,
        'utf8'
    )
    console.log(`!! ${menu}되었습니다`)
}

function loadJson(secretKey){ 
    // memo.json을 memoList 리스트로 읽어오기
    //console.log(`secretKey: ${secretKey}`)
    const tmpMemoJson = fileSystem.readFileSync('./memo.json', 'utf8')
    //console.log(`tmpMemoJson: ${tmpMemoJson}`)
    const memoJson = JSON.parse(tmpMemoJson)
    //console.log(`memoJson: ${memoJson}`)
    const decryptedData = CryptoJS.AES.decrypt(memoJson[0].encrypted, secretKey);
    //console.log(`decryptedData: ${decryptedData}`)
    const descryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
    //console.log(`descryptedText: ${descryptedText}`)
    //console.log(`typeof descryptedText: ${typeof descryptedText}`);
    let memoList = JSON.parse(descryptedText)
    //console.log(`memoList: ${memoList}`)
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
    if(memoList.length === 1){
        // memoList가 비어있을 경우에 대한 예외처리
        console.log(`!! ${menu}할 항목이 없습니다.`)
        return -1
    }
    for(let i = 1; i < memoList.length; i++){
        console.log(`[${i}] 제목: ${memoList[i].title}`)
        console.log(`--- 내용: ${memoList[i].content}`)
    }
    return 0
}

function selectMemo(memoList, menu){
    let memoNum = parseInt(readlineSyncModule.question(`?? ${menu}하고자 하는 메모의 번호를 입력하세요 >> `), 10)
    if(memoNum < 1 || memoNum  >= memoList.length){
        // 인덱스를 넘어가는 번호가 입력되었을 경우 예외처리
        console.log("!! 잘못된 입력입니다.")
        console.log("!! 메인 메뉴로 돌아갑니다.")
        return -1
    }
    return memoNum
}

function run(){
    // -- 프로그램의 시작 --
    let memoList = `[{"title" : null, "content" : null}]`

    // secretKey.json이 없을때 - 초기 비밀번호를 secretKey.json으로 저장하는 방식으로 파일 생성
    if (fileExists('./secretKey.json') === false){
        saveSecretKey("1234")
    }
    let secretKey = loadSecretKey()
    // memo.json이 없을때 - 빈 문자열을 memo.json으로 저장하는 방식으로 파일 생성
    if (fileExists('./memo.json') === false){
        saveJson(memoList, secretKey, "메모 저장공간이 생성")
    }

    
    console.log("?? 비밀번호를 입려하시오.")
    console.log("!! (초기 비밀번호는 1234 입니다.)")
    const inputKey = readlineSyncModule.question(">> ")
    if (inputKey != secretKey){
        console.log("!! 비밀번호가 틀렸습니다. 프로그램을 종료합니다.")
        process.exit(1)
    }
    memoList = loadJson(secretKey)
    console.log(`loadJson 후의 memoList: ${memoList}`)

    console.log("< 메모장 >")
    while(true){
        console.log()
        console.log("1. 작성 2. 조회 3. 수정 4. 삭제 5. 비밀번호 변경 6. 종료")
        const selectMenu = parseInt(readlineSyncModule.question("?? 메뉴 선택 >> "))
        switch(selectMenu){
            case 1: // 사용자가 "작성"을 선택했을 때
                secretKey = loadSecretKey() 
                let memoListW = loadJson(secretKey)
                let newJsonW = writeMemo()
                if(newJsonW === -1){
                    // 작성이 취소된 경우 switch-case문을 탈출
                    break
                }
                memoListW.push(newJsonW)
                saveJson(memoListW, secretKey, "새로운 메모가 저장")
                break
            case 2: // 사용자가 "조회"를 선택했을 때
                secretKey = loadSecretKey()
                let memoListS = loadJson(secretKey)
                searchMemo(memoListS, "조회")
                break
            case 3: // 사용자가 "수정"을 선택했을 때
                secretKey = loadSecretKey()
                let memoListR = loadJson(secretKey)
                let flagR = searchMemo(memoListR, "수정")
                if (flagR === -1){
                    // memoList가 비어있는 경우 예외처리
                    break
                }
                let memoNumR = selectMemo(memoListR, "수정")
                if(memoNumR === -1){
                    // 잘못된 숫자를 입력했을 경우  switch-case문을 탈출
                    break
                }
                let newJsonR = writeMemo()
                if(newJsonR === -1){
                    // 작성이 취소된 경우 switch-case문을 탈출
                    break
                }
                // memoList에서 사용자가 요청한 하나의 메모 수정
                memoListR.splice(memoNumR, 1, newJsonR)
                saveJson(memoListR, secretKey, "해당 메모가 수정")
                break
            case 4: // 사용자가 "삭제"를 선택했을 때
                secretKey = loadSecretKey() 
                let memoListD = loadJson(secretKey)
                let flagD = searchMemo(memoListD, "삭제")
                if (flagD === -1){
                    // memoList가 비어있는 경우 예외처리
                    break
                }
                let memoNumD = selectMemo(memoListD, "삭제")
                if(memoNumD === -1){
                    // 잘못된 숫자를 입력했을 경우  switch-case문을 탈출
                    break
                }
                // memoList에서 사용자가 요청한 하나의 메모 제거
                memoListD.splice(memoNumD, 1) 
                saveJson(memoListD, secretKey, "해당 메모가 삭제")
                break
            case 5: // 비밀번호 변경
                console.log("?? 새로운 비밀번호를 입력하세요")
                secretKey = readlineSyncModule.question(">> ")
                saveSecretKey(secretKey)
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