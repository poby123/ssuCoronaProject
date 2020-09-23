# ssuCoronaProject
##### 2020학년도 숭실대학교 창의적공학설계 '세미콜론' 코로나 프로젝트 서버
모든 라우터의 응답 형식은 JSON 형식입니다.

| 라우터 | 서브라우터 | 형식 | 파라미터 | 상황| 응답값|
|:---:|:---:|:---:|:---:|---|:---|
| /rest | /identify | GET | nfcId | 정상 |{'result':true, 'name':'홍길동', 'temperature':'36.5'}
| | | | | 정상인데 temperature 가 없는 경우| {'result' : true, 'name': '홍길동', temperature : null} 
| | | | | DB에 오류가 난 경우 | {'result' : false,  'name' : false }
| | | | |DB에 nfc Id가 없는 경우| {'result': false, 'name' : null} 
| | /addTempData | GET | nfcId, temperature| 정상| {'result':true}
| | | | | DB오류 혹은 파라미터값이 잘못된 경우 | {'result' : false}
| | /addUser | GET | nfcId, name | 정상 | {'result' : true }
| | | | | DB오류 혹은 파라미터값이 잘못된 경우 | {'result' : false}
| | /addYear | GET | - | 정상 | {'result' : true }
| | | | | DB오류(이미 컬럼이 있는데 시도한 경우 혹은 기타) | {'result' : false }
