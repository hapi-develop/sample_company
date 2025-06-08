// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // ハンバーガーメニューの制御
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // メニュー項目をクリックしたときにメニューを閉じる
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // スムーズスクロール
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ヘッダーのスクロール時の背景変更
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }
    
    // アニメーションの制御 (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.section-title, .service-card, .achievement-card, .news-item, .about-text, .company-stats, .hero-content, .contact-form, .contact-info');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // 数値カウントアップアニメーション
    const countUpElements = document.querySelectorAll('.stat-number');
    const countUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = element.textContent.replace(/[^\d]/g, '');
                const duration = 2000; // 2秒
                const increment = finalValue / (duration / 16); // 60fps
                let currentValue = 0;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(counter);
                    }
                    
                    if (element.textContent.includes('+')) {
                        element.textContent = Math.floor(currentValue) + '+';
                    } else if (element.textContent.includes('%')) {
                        element.textContent = Math.floor(currentValue) + '%';
                    } else if (element.textContent.includes('年')) {
                        element.textContent = Math.floor(currentValue) + '年';
                    } else {
                        element.textContent = Math.floor(currentValue);
                    }
                });
                
                countUpObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    countUpElements.forEach(el => {
        countUpObserver.observe(el);
    });
    
    // お問い合わせフォームの処理
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(this);
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // バリデーション
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '#e2e8f0';
                }
            });
            
            // メールアドレスの形式チェック
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#ef4444';
                }
            }
            
            if (!isValid) {
                showNotification('必須項目をすべて入力してください。', 'error');
                return;
            }
            
            // 送信処理の疑似実装
            button.textContent = '送信中...';
            button.disabled = true;
            
            // 疑似的な送信処理（実際のプロジェクトではサーバーサイドの処理が必要）
            setTimeout(() => {
                // 成功メッセージの表示
                showNotification('お問い合わせを受け付けました。ありがとうございます。', 'success');
                
                // フォームのリセット
                this.reset();
                
                // ボタンを元に戻す
                button.textContent = originalText;
                button.disabled = false;
                
                // フォームの境界線をリセット
                requiredFields.forEach(field => {
                    field.style.borderColor = '#e2e8f0';
                });
            }, 2000);
        });
    }
    
    // 通知メッセージの表示関数
    function showNotification(message, type = 'info') {
        // 既存の通知があれば削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 通知要素の作成
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        // タイプに応じた色設定
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#2563eb';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // アニメーションで表示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 5秒後に自動で削除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // ページの読み込み完了後の初期アニメーション
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in');
        }
    }, 300);
    
    // パフォーマンス最適化：デバウンス関数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // スクロールイベントのデバウンス処理
    const debouncedScrollHandler = debounce(() => {
        // 追加のスクロール処理があればここに記述
    }, 100);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // サービス詳細モーダル機能
    const serviceData = {
        cloud: {
            title: 'クラウドソリューション',
            icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            overview: 'AWS、Azure、GCPなどの主要クラウドプラットフォームを活用し、お客様のビジネスニーズに最適化されたクラウドインフラを構築・運用いたします。オンプレミスからクラウドへの移行、ハイブリッドクラウド環境の構築、クラウドネイティブアプリケーションの開発まで、包括的なソリューションを提供します。',
            features: [
                'AWS、Azure、GCP全対応のマルチクラウド環境',
                'Auto Scaling による自動スケーリング',
                '高可用性・災害復旧対応のアーキテクチャ',
                'セキュリティベストプラクティスの実装',
                'コスト最適化とモニタリング'
            ],
            benefits: [
                'インフラコストの大幅削減（平均30-50%）',
                'システムの可用性向上（99.9%以上）',
                '運用負荷の軽減とDevOps文化の浸透',
                'グローバル展開の容易性',
                '最新技術への迅速なアクセス'
            ],
            technologies: ['AWS', 'Microsoft Azure', 'Google Cloud Platform', 'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Jenkins', 'Prometheus', 'Grafana'],
            process: [
                '現状分析・要件定義',
                'クラウドアーキテクチャ設計',
                'セキュリティ・コンプライアンス設計',
                'マイグレーション計画策定',
                '段階的移行実行',
                '運用監視体制構築',
                'パフォーマンス最適化'
            ]
        },
        ai: {
            title: 'AI・機械学習',
            icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 2C8.67 2 8 2.67 8 3.5V20.5C8 21.33 8.67 22 9.5 22S11 21.33 11 20.5V3.5C11 2.67 10.33 2 9.5 2ZM14.5 8C13.67 8 13 8.67 13 9.5V20.5C13 21.33 13.67 22 14.5 22S16 21.33 16 20.5V9.5C16 8.67 15.33 8 14.5 8Z" fill="currentColor"/></svg>',
            overview: '最先端のAI技術と機械学習アルゴリズムを活用し、お客様のビジネス課題を解決するインテリジェントなソリューションを開発します。ビッグデータ解析、予測分析、自然言語処理、画像認識など、幅広いAI技術を組み合わせて、業務の自動化と意思決定の高度化を実現します。',
            features: [
                '深層学習・機械学習モデルの開発',
                'ビッグデータ解析・予測分析',
                '自然言語処理（NLP）・チャットボット',
                'コンピュータビジョン・画像認識',
                'レコメンデーションエンジン'
            ],
            benefits: [
                '業務プロセスの自動化（効率性向上70%以上）',
                'データドリブンな意思決定の実現',
                '顧客体験の向上とパーソナライゼーション',
                '予測精度向上による リスク軽減',
                '新たなビジネス機会の創出'
            ],
            technologies: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'OpenAI API', 'Hugging Face', 'Apache Spark', 'MLflow', 'Jupyter', 'Databricks'],
            process: [
                'ビジネス課題とAI適用領域の特定',
                'データ収集・前処理・品質評価',
                'アルゴリズム選定・モデル設計',
                '学習データ準備・モデル訓練',
                'モデル評価・チューニング',
                '本番環境デプロイ・運用',
                '継続的学習・モデル改善'
            ]
        },
        development: {
            title: 'システム開発',
            icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7L12 12L22 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            overview: '業務システム、Webアプリケーション、モバイルアプリケーションの企画・設計・開発から保守運用まで、一貫したシステム開発サービスを提供します。アジャイル開発手法を採用し、お客様と密接に連携しながら、ユーザビリティと拡張性を重視したシステムを構築します。',
            features: [
                'アジャイル・スクラム開発手法',
                'フルスタック開発（フロントエンド〜バックエンド）',
                'マイクロサービスアーキテクチャ',
                'API設計・開発',
                'モバイルアプリ開発（iOS/Android）'
            ],
            benefits: [
                '短期間での高品質システム構築',
                'ユーザー中心設計による使いやすさ',
                '将来の機能拡張・保守性の確保',
                'クロスプラットフォーム対応',
                '運用コストの最適化'
            ],
            technologies: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'Flutter', 'React Native', 'PostgreSQL', 'MySQL', 'MongoDB'],
            process: [
                '要件定義・仕様策定',
                'UI/UX設計・プロトタイピング',
                'システム設計・アーキテクチャ',
                '開発環境構築・CI/CD設定',
                'アジャイル開発・テスト',
                '本番リリース・デプロイ',
                '運用保守・機能追加'
            ]
        },
        dx: {
            title: 'DXコンサルティング',
            icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 5.26L17 4L15.74 7.74L19 9L15.74 10.26L17 14L13.09 12.74L12 16L10.91 12.74L7 14L8.26 10.26L5 9L8.26 7.74L7 4L10.91 5.26L12 2Z" fill="currentColor"/></svg>',
            overview: 'デジタルトランスフォーメーション（DX）の戦略立案から実行まで、企業のデジタル化を総合的にサポートします。現状分析、DX戦略策定、技術選定、組織変革、人材育成まで、持続可能なデジタル変革を実現するためのコンサルティングサービスを提供します。',
            features: [
                'DX戦略策定・ロードマップ作成',
                'デジタル成熟度診断・ギャップ分析',
                '業務プロセス再設計・自動化',
                'データ活用戦略・データガバナンス',
                '組織変革・人材育成支援'
            ],
            benefits: [
                '競争優位性の確立と市場シェア拡大',
                '業務効率化と生産性向上（平均40%向上）',
                '顧客満足度とエンゲージメント向上',
                'イノベーション創出文化の醸成',
                '持続可能な成長基盤の構築'
            ],
            technologies: ['Salesforce', 'Microsoft 365', 'Power Platform', 'Tableau', 'Power BI', 'Slack', 'Zoom', 'RPA', 'IoT', 'Blockchain'],
            process: [
                '現状分析・デジタル成熟度診断',
                'DXビジョン・戦略策定',
                '優先順位付け・ロードマップ作成',
                'パイロットプロジェクト実行',
                '本格展開・スケールアップ',
                '組織・プロセス変革支援',
                '効果測定・継続改善'
            ]
        }
    };

    // モーダル要素の取得
    const modal = document.getElementById('service-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalIcon = document.getElementById('modal-icon');
    const modalOverview = document.getElementById('modal-overview');
    const modalFeatures = document.getElementById('modal-features');
    const modalBenefits = document.getElementById('modal-benefits');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalProcess = document.getElementById('modal-process');
    
    // サービスカードクリックイベント
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceKey = this.dataset.service;
            const service = serviceData[serviceKey];
            
            if (service) {
                showServiceModal(service);
            }
        });
    });
    
    // モーダル表示関数
    function showServiceModal(service) {
        // コンテンツの設定
        modalTitle.textContent = service.title;
        modalIcon.innerHTML = service.icon;
        modalOverview.textContent = service.overview;
        
        // 特徴リストの設定
        modalFeatures.innerHTML = '';
        service.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
        
        // メリットリストの設定
        modalBenefits.innerHTML = '';
        service.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.textContent = benefit;
            modalBenefits.appendChild(li);
        });
        
        // 技術タグの設定
        modalTechnologies.innerHTML = '';
        service.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            modalTechnologies.appendChild(span);
        });
        
        // プロセスリストの設定
        modalProcess.innerHTML = '';
        service.process.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            modalProcess.appendChild(li);
        });
        
        // モーダル表示
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // モーダル閉じる関数
    function closeServiceModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // モーダル閉じるイベント
    modalClose.addEventListener('click', closeServiceModal);
    modalOverlay.addEventListener('click', closeServiceModal);
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeServiceModal();
        }
    });
    
    // モーダル内のお問い合わせボタンクリック
    const modalCta = modal.querySelector('.modal-cta');
    if (modalCta) {
        modalCta.addEventListener('click', function() {
            closeServiceModal();
        });
    }
}); 