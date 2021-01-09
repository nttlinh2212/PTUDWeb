# PTUDWeb
13/12: Linh t moi update lai file database mn chay lai nhe
mn nhớ sửa lại file default.config đúng với máy mình nha-> chạy npm install->npm start
Vi cai menu trang nao cung co het=> t de 2 bien local: lstCat1 va lstCat2 nen mn co the xai trong view ma ko can khai bao o routes
Image: ten thi t de mac dinh la id nha, rieng course vi thầy yeu cau co 2 cai anh: 1 nho, 1 lon ma t mới tim dc nhỏ: thumb, chua tim dc lon
Lúc mn viết view t đã truyền biến vào rồi, mn chạy cái view đó lên rồi xem thử nội dung các biến đó rồi làm nha
Về star: t có lưu 5 biến star1,2,3,4,5 là số student đánh giá 1 sao,... mn cộng lại rồi chia cho tổng số sv thì đc star nha
mn xóa dùm t file images ngoài cùng với nha ko biết sao t xóa ko đc
18/12: Linh i express-layout create layout: layouts.ejs viet header và footer vào trong này có tạo 2 biến css và js để chèn vào css và js
20/12: Linh: Muốn đk tài khoản /account/register->trong đó có 1 form và 1 but submit->js: on_submit(get.json(/is-available) check thử gmail đã có tồn tại chưa nếu oke thì submit đến post/register:hash(pass), lưu vào sesstion thông tin user và render đến view /verify, trên view có button send(getjson(/send-otp) để send mess cho email rồi màn hình cho thêm ô để nhập code và but send chuyển thành resend và thêm button submit để check mã code về đường link post/verify
22/12: Trong view có thể sử dụng 2 hàm này để format tiền và star
vd getCurrency(tien), getStar(12,23,23,12,2)
cụ thể: <%= getCurrency(element.promotional_price) %>
để sử dụng đc trong view lúc render truyền 2 biến này vào 
4/1/2021
Đat: -điều lại format tiền tệ, t đã truyền 2 hàm vào cho ông ông nên sử dụng:hàm tính star, format tiền( ĐỌC rồi thì sửa đi nha đừng để lâu dài nửa)
-trang course/detail/9 chạy cái mục tiền bị chuyển xuống dưới
- brif information chuyển vào bên dưới cái tiêu đề format nổi bật hơn cái description
-thieu ds 5 khoa hoc cung linh vuc 
CẤP VIDEO: video/courseid/1 video preview và lessionid mỗi lectionid 1 video 104.mp4
	video/1/102.mp4 
	video/1/preview.mp4
9/1/2021: Linh
Vy

-Ở mọi trang đều có biến local: CartSummary là tổng số lượng khóa học trong cart trên thanh nav, bà thêm hiệu ứng khi add 1 course vào cart nha VY
-add/remove: ajax bà chỉ cần gọi đường dẫn thôi
-/get-total-money: ajax cho trường hợp bà tính tổng số tiền phải trả ở view check out
-/checkout là kiểu post: chỉ cần gửi form rổng về là đc vì trong session đã có chứa thông tin đơn hàng

-ở trang home thiếu hiển thị số lượng học viên đánh giá
