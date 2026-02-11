// --- DATA: DANH SÁCH LỜI CHÚC ---
        const wishes = [
            "Chúc bạn 12 tháng phú quý, 365 ngày phát tài, 8760 giờ sung túc, 525600 phút thành công, 31536000 giây vạn sự như ý.",
            "Năm mới Bính Ngọ, chúc bạn: Mã đáo thành công - Tấn tài tấn lộc - Vạn sự bình an.",
            "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin.",
            "Chúc bạn: Đau đầu vì nhà giàu. Mệt mỏi vì học giỏi. Buồn phiền vì nhiều tiền. Ngang trái vì xinh gái. Và mất ngủ vì không có đối thủ!",
            "Cung chúc tân xuân phước vĩnh cửu. Chúc trong gia quyến được an khương. Tân niên lai đáo đa phú quý. Xuân đến an khương vạn thọ tường.",
            "Năm mới chúc nhau sức khỏe nhiều. Bạc tiền rủng rỉnh thoải mái tiêu. Gia đình hạnh phúc bè bạn quý. Thanh thản vui chơi mọi buổi chiều.",
            "Chúc mừng năm mới 2026. Chúc bạn nghìn sự như ý, vạn sự như mơ, triệu sự bất ngờ, tỷ lần hạnh phúc.",
            "Năm Ngựa chúc bạn sức khỏe vô biên, kiếm được nhiều tiền, đời sướng như tiên.",
            "Tống cựu nghênh tân – Vạn sự cát tường – Toàn gia hạnh phúc.",
            "Chúc bạn năm mới: Ăn nhiều không béo, tiền nhiều không méo, tình cảm không héo."
        ];

        // --- STATE MANAGEMENT ---
        const screens = {
            quiz: document.getElementById('screen-quiz'),
            loading: document.getElementById('screen-loading'),
            card: document.getElementById('screen-card')
        };
        const musicBtn = document.getElementById('music-btn');
        const bgMusic = document.getElementById('bg-music');
        let isPlaying = false;
        let fireworksActive = false;

        // --- AUTOPLAY LOGIC ---
        // Cố gắng phát nhạc ngay khi tải trang
        document.addEventListener('DOMContentLoaded', () => {
            bgMusic.volume = 0.5; // Đặt âm lượng vừa phải
            
            // Promise kiểm tra xem trình duyệt có cho phép autoplay không
            const playPromise = bgMusic.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Autoplay thành công
                    isPlaying = true;
                    musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                })
                .catch(error => {
                    // Autoplay bị chặn
                    console.log("Trình duyệt chặn autoplay. Chờ tương tác của người dùng.");
                    isPlaying = false;
                    musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    
                    // Thêm sự kiện click một lần vào body để bật nhạc khi người dùng chạm vào bất cứ đâu
                    const enableAudio = () => {
                        bgMusic.play();
                        isPlaying = true;
                        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                        // Xóa sự kiện sau khi đã chạy xong
                        document.removeEventListener('click', enableAudio);
                    };
                    document.addEventListener('click', enableAudio);
                });
            }
        });

        // --- FUNCTIONS ---

        // 1. Chuyển cảnh
        function switchScreen(fromId, toId) {
            const fromScreen = screens[fromId];
            const toScreen = screens[toId];

            fromScreen.style.opacity = '0';
            setTimeout(() => {
                fromScreen.classList.remove('active');
                toScreen.classList.add('active');
                // Trigger reflow
                void toScreen.offsetWidth;
                toScreen.style.opacity = '1';
            }, 800);
        }

        // 2. Xử lý khi chọn đáp án
        function handleAnswer(choice) {
            console.log("User chose: " + choice);
            // Có thể lưu lựa chọn vào localStorage nếu muốn
            switchScreen('quiz', 'loading');

            // Giả lập thời gian chờ 2 giây rồi chuyển sang thiệp
            setTimeout(() => {
                switchScreen('loading', 'card');
                startFireworks();
            }, 2500);
        }

        // 3. Random câu chúc
        function randomWish() {
            const content = document.getElementById('greeting-content');
            
            // Animation fade text
            content.style.opacity = 0;
            
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * wishes.length);
                content.innerHTML = `<p class="text-lg leading-relaxed text-white font-serif-display italic">"${wishes[randomIndex]}"</p>`;
                content.style.opacity = 1;
            }, 300);
        }

        // 4. Chia sẻ (Copy link)
        function shareLink() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert("Đã sao chép liên kết! Hãy gửi cho bạn bè nhé.");
            });
        }

        // 5. Làm lại từ đầu
        function restart() {
            switchScreen('card', 'quiz');
            stopFireworks();
        }

        // 6. Xử lý nhạc (Nút bật/tắt thủ công)
        musicBtn.addEventListener('click', (e) => {
            // Ngăn sự kiện click này lan ra body (tránh kích hoạt enableAudio 2 lần nếu trùng)
            e.stopPropagation(); 
            
            if (isPlaying) {
                bgMusic.pause();
                musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.play();
                musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            isPlaying = !isPlaying;
        });

        // --- FIREWORKS EFFECT (CANVAS) ---
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function createParticle(x, y) {
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: x,
                    y: y,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    radius: Math.random() * 3,
                    velocity: {
                        x: (Math.random() - 0.5) * 6,
                        y: (Math.random() - 0.5) * 6
                    },
                    life: 100,
                    alpha: 1
                });
            }
        }

        function animateFireworks() {
            if (!fireworksActive) return;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            // Random auto fireworks
            if (Math.random() < 0.05) {
                createParticle(Math.random() * canvas.width, Math.random() * canvas.height / 2);
            }

            particles.forEach((p, index) => {
                if (p.life > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.fill();
                    ctx.globalAlpha = 1;

                    p.x += p.velocity.x;
                    p.y += p.velocity.y;
                    p.velocity.y += 0.05; // Gravity
                    p.life--;
                    p.alpha -= 0.01;
                } else {
                    particles.splice(index, 1);
                }
            });

            animationId = requestAnimationFrame(animateFireworks);
        }

        function startFireworks() {
            if (!fireworksActive) {
                fireworksActive = true;
                animateFireworks();
            }
        }

        function stopFireworks() {
            fireworksActive = false;
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = [];
        }

        // Click on canvas to create fireworks (Desktop only)
        canvas.addEventListener('click', (e) => {
            if (fireworksActive) {
                createParticle(e.clientX, e.clientY);
            }
        });