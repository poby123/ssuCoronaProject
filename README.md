# ssuCoronaProject
##### 2020학년도 숭실대학교 창의적공학설계 '세미콜론' 코로나 프로젝트 서버
모든 라우터의 응답 형식은 JSON 형식입니다.


| URI | 형식 | 설명 |
| /rest/user/identify | GET | ?nfcid=1234 형식으로 파라미터를 받아서 사용자가 존재하면 {'result':true, 'name':이름, 'temperature':'36.5} 이런 식의 json을 리턴한다.
