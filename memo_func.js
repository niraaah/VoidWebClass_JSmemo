import readlineSyncModule from "readline-sync";

let memoTitle = [], memoContent = [] // 제목과 내용을 빈 배열로 선언한다
let tmp = ""

function viewList(memoTitle){
    console.log("제목:") // 리스트를 순서대로 출력
            for(let i = 0; i < memoTitle.length; i++){
                console.log(`[${i}] ${memoTitle[i]}`)
            }
}

function selectSubMenu(memoTitle){
    const select = parseInt(readlineSyncModule.question("번호: "))
            // 선택한 번호가 리스트의 길이를 넘어가는 경우 예외처리
            if(select >= memoTitle.length){
                console.log("잘못된 번호입니다!")
                return false
            }
    return select
}

function saveContent(memoTitle, memoContent){
    let tmp = readlineSyncModule.question("제목: ")
    if(tmp === ""){ // 입력한 문자열이 없을 때 예외처리
        console.log("빈 문자열이 입력되었습니다.")
        return false
    }
    memoTitle.push(tmp)
    tmp = readlineSyncModule.question("내용: ")
    if(tmp === ""){ // 입력한 문자열이 없을 때 예외처리
        console.log("빈 문자열이 입력되었습니다.")
        memoTitle.pop() // 마지막으로 저장했던 제목을 삭제
        return false
    }
    memoContent.push(tmp) 
    console.log("저장 완료.") // 사용자가 진행을 알 수 있도록 수행 완료 표시
    return true
}

console.log(" < 메모 프로그램 > ")
while (true){
    console.log("")
    console.log("1. 작성 2. 조회 3. 수정 4. 삭제 5. 추가기능 6. 종료")
    const userSelect = parseInt(readlineSyncModule.question("메뉴 선택: "), 10)
    
    switch (userSelect){
        case 1: // 사용자가 "작성"을 선택한 경우
            const saveFlag = saveContent(memoTitle, memoContent)
            if(saveFlag === true) break
            else{
                console.log("저장이 취소되었습니다.")
                break
            }
        case 2: // 사용자가 "조회"를 선택한 경우
            if(memoTitle.length === 0 && memoContent.length === 0){
                // 제목과 내용이 비어있는 경우
                console.log("조회할 제목과 내용이 없습니다.")
                break
            }else{ // 제목을 출력한다
                viewList(memoTitle)
                select = selectSubMenu(memoTitle)
                if(select === false) break
                console.log(`조회한 내용: ${memoContent[select]}`)
                break
            }
        case 3: // 사용자가 "수정"을 선택한 경우
        if(memoTitle.length === 0 && memoContent.length === 0){
            // 제목과 내용이 비어있는 경우
            console.log("수정할 제목과 내용이 없습니다.")
            break
        }else{ // 제목을 출력한다
            viewList(memoTitle)
            select = selectSubMenu(memoTitle)
            if(select === false) break

            const saveFlag = saveContent(memoTitle, memoContent)
            if(saveFlag === true) break
            else{
                console.log("저장이 취소되었습니다.")
                break
            }
        }
        case 4: // 사용자가 "삭제"를 선택한 경우
            if(memoTitle.length === 0 && memoContent.length === 0){
                // 제목과 내용이 비어있는 경우
                console.log("삭제할 제목과 내용이 없습니다.")
                break
            }else{ // 제목을 출력한다
                viewList(memoTitle)
                select = selectSubMenu(memoTitle)
                if(select === false) break
                memoTitle.splice(select, 1) // 해당 인덱스의 제목 요소 삭제
                memoContent.splice(select, 1) // 해당 인덱스의 내용 요소 삭제
                console.log("삭제 완료.") // 사용자가 진행을 알 수 있도록 수행 완료 표시
                break
            }
        case 5: // 사용자가 "추가기능"을 선택한 경우
            break
        case 6: // 사용자가 "종료"를 선택한 경우
            console.log("종료합니다!")
            process.exit(1)  // 프로세스를 종료한다
    }
}