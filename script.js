// --- DATA (Poetic/Healing Edition) ---
        const wishes = [
            "Chúc bạn năm mới dịu dàng như mây, tự do như gió, và trái tim luôn ấm áp như nắng ban mai.",
            "Mong năm mới bạn tìm thấy niềm vui trong những điều nhỏ bé nhất: một tách trà ngon, một cuốn sách hay, một ngày nắng đẹp.",
            "Chúc bạn năm 2026: Đủ dũng cảm để theo đuổi ước mơ, đủ bình yên để tận hưởng hiện tại.",
            "Năm mới Bính Ngọ, mong bạn vững chãi như cây, nở hoa rực rỡ và luôn hướng về phía mặt trời.",
            "Không cần phải rực rỡ như pháo hoa, chỉ cần bền bỉ và ấm áp như ngọn đèn nhỏ. Chúc bạn an yên.",
            "Chúc bạn một năm mới không muộn phiền. Mọi vết thương đều được chữa lành, mọi nỗ lực đều được đền đáp.",
            "Hãy sống như một chú mèo: Ăn ngon, ngủ kỹ, được yêu thương và luôn kiêu hãnh.",
            "Mã đáo thành công. Chúc bạn chạy nhanh như gió trên thảo nguyên xanh của chính mình.",
            "Năm mới, mong bạn luôn có một nơi để trở về, một người để yêu thương và một giấc mơ để hy vọng.",
            "Chúc mọi cơn mưa đi qua đều để lại cầu vồng. Chúc mọi khó khăn đều giúp bạn mạnh mẽ hơn."
        ];

        // --- CORE LOGIC ---
        const screens = {
            quiz: document.getElementById('screen-quiz'),
            loading: document.getElementById('screen-loading'),
            card: document.getElementById('screen-card')
        };
        const musicBtn = document.getElementById('music-btn');
        const bgMusic = document.getElementById('bg-music');
        let isPlaying = false;
        let firefliesActive = false;

        // --- INIT & AUTOPLAY ---
        document.addEventListener('DOMContentLoaded', () => {
            bgMusic.volume = 0.4;
            // Attempt autoplay
            bgMusic.play().then(() => updateMusicState(true)).catch(() => updateMusicState(false));
            
            // Start Canvas immediately for ambience
            startFireflies();
        });

        function updateMusicState(playing) {
            isPlaying = playing;
            musicBtn.innerHTML = playing ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            if (playing) bgMusic.play(); else bgMusic.pause();
        }

        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateMusicState(!isPlaying);
        });

        // --- NAVIGATION ---
        function switchScreen(fromId, toId) {
            const fromScreen = screens[fromId];
            const toScreen = screens[toId];
            fromScreen.style.opacity = '0';
            setTimeout(() => {
                fromScreen.classList.remove('active');
                toScreen.classList.add('active');
                void toScreen.offsetWidth; 
                toScreen.style.opacity = '1';
            }, 800);
        }

        function handleAnswer(choice) {
            switchScreen('quiz', 'loading');
            setTimeout(() => {
                randomWish();
                switchScreen('loading', 'card');
            }, 2500); // Slower transition for calmness
        }

        function randomWish() {
            const content = document.getElementById('greeting-content');
            content.style.opacity = 0;
            
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * wishes.length);
                content.innerHTML = `<p class="font-hand text-2xl text-[#4A4E69] leading-loose">${wishes[randomIndex]}</p>`;
                content.style.opacity = 1;
            }, 500);
        }

        function shareLink() {
            navigator.clipboard.writeText(window.location.href).then(() => alert("Đã lưu liên kết vào túi thần kỳ!"));
        }

        function restart() {
            switchScreen('card', 'quiz');
        }

        // --- FIREFLIES (DOM DOM) EFFECT ---
        const canvas = document.getElementById('fireflies-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function createFirefly() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                alpha: Math.random(),
                pulseSpeed: 0.02 + Math.random() * 0.03
            };
        }

        for(let i=0; i<40; i++) particles.push(createFirefly());

        function animateFireflies() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                if(p.x < 0) p.x = canvas.width;
                if(p.x > canvas.width) p.x = 0;
                if(p.y < 0) p.y = canvas.height;
                if(p.y > canvas.height) p.y = 0;
                
                p.alpha += p.pulseSpeed;
                if(p.alpha > 1 || p.alpha < 0.2) p.pulseSpeed = -p.pulseSpeed;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 200, ${Math.abs(p.alpha)})`; 
                ctx.shadowBlur = 10;
                ctx.shadowColor = "white";
                ctx.fill();
            });

            requestAnimationFrame(animateFireflies);
        }

        function startFireflies() {
            animateFireflies();
        }
