import readlineSyncModule from "readline-sync";

let memoTitle = "", memoContent = "" // 제목과 내용을 빈 문자열로 선언한다
console.log(" < 메모 프로그램 > ")
while (true){
    console.log("1. 작성 2. 조회 3. 수정 4. 삭제 5. 추가기능 6. 종료")
    const userSelect = parseInt(readlineSyncModule.question("메뉴 선택: "), 10)
    
    switch (userSelect){
        case 1: // 사용자가 "작성"을 선택한 경우
            memoTitle = readlineSyncModule.question("제목: ")
            memoContent = readlineSyncModule.question("내용: ") 
            break
        case 2: // 사용자가 "조회"를 선택한 경우
            if(memoTitle == "" && memoContent == ""){
                // 제목과 내용이 비어있는 경우
                console.log("조회할 제목과 내용이 없습니다.")
                break
            }else{ // 재목과 내용을 출력한다
                console.log(`제목: ${memoTitle}`)
                console.log(`내용: ${memoContent}`)
                break
            }
        case 3: // 사용자가 "수정"을 선택한 경우
            if(memoTitle === "" && memoContent === ""){
                // 제목과 내용이 비어있는 경우
                console.log("수정할 제목과 내용이 없습니다.")
                break
            }else{ // 현재 내용을 보여주고 수정 내용을 받는다
                console.log(`현재 제목: ${memoTitle}`)
                console.log(`현재 내용: ${memoContent}`)
                memoTitle = readlineSyncModule.question("새로운 제목: ")
                memoContent = readlineSyncModule.question("새로운 내용: ")
                break
            }
        case 4: // 사용자가 "삭제"를 선택한 경우
            if(memoTitle == "" && memoContent == ""){
                // 제목과 내용이 비어있는 경우
                console.log("삭제할 제목과 내용이 없습니다.")
                break
            }else{ // 제목과 내용을 빈 문자열로 초기화한다
                memoTitle = ""
                memoContent = ""
                console.log("삭제되었습니다.")
                break
            }
        case 5: // 사용자가 "추가기능"을 선택한 경우
            break
        case 6: // 사용자가 "종료"를 선택한 경우
            console.log("종료합니다!")
            process.exit(1)  // 프로세스를 종료한다
    }
}