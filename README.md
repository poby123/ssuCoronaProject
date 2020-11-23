# ssuCoronaProject
##### 2020학년도 숭실대학교 창의적공학설계 '세미콜론' 코로나 프로젝트 서버
응답 형식은 JSON 입니다.


| URI | 형식 | 파라미터 | 설명 |
|:---|:---:|:---:|:---:|
| /rest/user | POST | {'name': , 'nfcid': , 'belong':, 'id':} | 사용자 추가, 추가할 사용자가 여러명이면 파라미터를 배열로.|
| /rest/user | DELETE | {'nfcid':} | 사용자 삭제, 삭제할 사용자가 여러명이면 파라미터를 배열로.|
| /rest/user/identify | GET | nfcid=id | nfcid에 해당하는 사용자 정보가 있는지 확인.|
| /rest/user/all | GET | - | 체온 정보를 포함한 모든 사용자 정보 확인.|
| /rest/user/withouttemp | GET | - | 체온 정보를 제외한 모든 사용자 정보 확인.|
| /rest/user/addTempData | GET | nfcid=id&temperature=temp | 체온 저장|
| /rest/addYear | GET | - | 날짜별로 체온을 저장하기 위한 1년치 컬럼을 생성.
