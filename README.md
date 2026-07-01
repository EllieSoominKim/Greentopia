# Greentopia (그린토피아)

딥러닝 기반 실시간 쓰레기 분류와 사용자 참여형 위치 공유를 결합한 환경 실천 웹 플랫폼입니다.

## 링크

- [보고서 (PDF)](https://your-report-link-here)
- [시연 영상](https://drive.google.com/your-demo-video-link-here](https://drive.google.com/file/d/1FFEUT9H_aKZxNnbs0dJ_nPtwOhthMTav/view?usp=sharing)

## 프로젝트 소개

공공장소에서의 쓰레기 분리배출은 공동체의 책임을 요구하지만, 쓰레기통 위치 정보 부족과 분류 방법에 대한 인식 미비로 적절한 처리가 이루어지지 않는 경우가 많습니다. Greentopia는 이러한 문제를 해결하기 위해 딥러닝 기반 실시간 쓰레기 분류 기능과 사용자 참여형 쓰레기통 위치 공유 시스템을 결합한 통합 웹 플랫폼입니다.

사용자가 정보를 인식하고, 행동으로 옮기고, 그 과정에서 학습까지 이어지도록(**인지 → 행동 → 학습**) 설계했습니다.

## 핵심 기능

### 1. 실시간 쓰레기 분류

- Google Teachable Machine으로 학습한 커스텀 이미지 분류 모델을 사용해 웹캠으로 촬영한 쓰레기를 실시간으로 분석합니다.
- 분류 대상: 플라스틱, 비닐, 종이, 유리, 캔, 일반쓰레기 (6종)
- 예측 정확도 70% 이상이 1.5초 이상 유지되면 결과가 최종 확정됩니다.
- 음식물 잔여물 여부에 따라 일반쓰레기 배출 안내 또는 분리배출·업사이클링 방안을 추천합니다.

### 2. 주변 쓰레기통 위치 공유

- Google Maps JavaScript API 기반으로, 사용자가 지도에서 직접 쓰레기통 위치를 등록하고 공유할 수 있습니다.
- 마커에 "플라스틱만 가능", "밤 10시 이후 사용 금지" 같은 메모를 남길 수 있습니다.
- Firestore와 연동되어 등록된 정보가 전체 사용자에게 실시간으로 공유됩니다.
- 잘못된 정보는 마커 삭제를 통해 수정할 수 있습니다.

### 3. 환경 퀴즈 및 랭킹 시스템

- OX 형식의 환경 퀴즈 10문제가 무작위로 출제됩니다. (정답 +10점 / 오답 -5점)
- 결과는 Firestore에 사용자 ID와 연동되어 저장됩니다.
- 상위 10명이 실시간으로 정렬되는 랭킹 페이지를 제공합니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React.js (SPA), Tailwind CSS, Context API |
| 백엔드 / 데이터베이스 | Firebase Authentication, Firestore |
| AI 분류 모델 | Google Teachable Machine (이미지 분류) |
| 지도 기능 | Google Maps JavaScript API |

## 폴더 구조

```
src/
├── data/              # Firebase 연동 로직, 퀴즈 데이터
├── image/             # 정적 이미지 리소스
├── pages/             # 페이지 단위 컴포넌트
│   ├── Home.js
│   ├── Detect.js       # 쓰레기 분류
│   ├── Map.js           # 위치 공유
│   ├── Quiz.js
│   ├── QuizResult.js
│   └── Ranking.js
├── UserContext.js     # 사용자 정보/포인트 전역 상태
└── App.js
```

## 실행 방법

```bash
git clone https://github.com/your-id/greentopia.git
cd greentopia
npm install
```

루트 디렉토리에 `.env` 파일을 생성하고 아래 값을 채워주세요.

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_GOOGLE_MAPS_API_KEY=
```

```bash
npm start
```

## 성능 평가

6개 쓰레기 분류 항목을 대상으로 각 10장씩 총 60장의 테스트 이미지를 다양한 조명·배경 조건에서 평가했습니다. (정확도 70% 이상이 2초 이상 유지될 경우 분류 성공으로 간주)

| 분류 항목 | 정확도(%) | 평균 인식 시간(ms) | 주요 오분류 대상 |
|---|---|---|---|
| 플라스틱 | 75.0 | 1450 | 비닐 |
| 종이 | 73.3 | 1300 | 일반쓰레기 |
| 유리 | 71.7 | 1580 | 캔 |
| 캔 | 78.3 | 1420 | - |
| 비닐 | 66.7 | 1630 | 배경에 따른 오분류 |
| 일반쓰레기 | 70.0 | 1690 | 치킨뼈 등 |
| **전체 평균** | **72.5** | **1512** | |

비닐과 플라스틱, 종이와 일반쓰레기처럼 외형이 유사한 항목 간 오분류 경향이 뚜렷하게 나타났으며, 이는 Teachable Machine의 단순 표면 이미지 학습 구조가 질감·반사·투명도 같은 복합적 시각 정보를 구분하는 데 한계가 있기 때문으로 분석됩니다.

## 향후 개선 방향

- 다중 레이어 구조의 커스텀 CNN 모델 도입을 통한 분류 정밀도 향상
- 조도·배경·촬영 각도를 다변화한 학습 데이터셋 확충
- ID 중복 검증 및 비밀번호 기반 사용자 인증 체계 도입
- 마커 신고/평점 기능을 통한 위치 정보 신뢰도 검증 구조 마련
- 난이도별 문제은행 확장 및 적응형 퀴즈 출제 알고리즘 도입

## 라이선스

본 프로젝트는 학술 목적(AI융합개론 과제)으로 제작되었습니다.
