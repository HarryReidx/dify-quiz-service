$(function(){
            let currentMode = 'exam';
            let currentCardIndex = 0;
            let practiceStats = { correct: 0, incorrect: 0, answered: [] };
            let isFlipped = false;

            // 鍒濆鍖?
            console.log('=== 椤甸潰鍒濆鍖栧紑濮?===');
            initializePracticeMode();
            updateProgress();

            // 纭繚鑰冭瘯妯″紡涓嬫寜閽彲瑙?
            console.log('璁剧疆鍒濆妯″紡涓鸿€冭瘯妯″紡');
            $('#exam-mode').addClass('active').show();
            $('#practice-mode').removeClass('active').hide();
            $('#quiz-actions').removeClass('hidden').show();

            // 妫€鏌ユ寜閽姸鎬?
            console.log('quiz-actions 鏄惁鍙:', $('#quiz-actions').is(':visible'));
            console.log('quiz-actions 鏄惁鏈?hidden 绫?', $('#quiz-actions').hasClass('hidden'));
            console.log('鎻愪氦绛旀鎸夐挳鏄惁瀛樺湪:', $('#check-questions').length);
            console.log('閲嶆柊寮€濮嬫寜閽槸鍚﹀瓨鍦?', $('#reset-questions').length);

            // 妫€鏌ユ寜閽殑瀹為檯鏍峰紡
            const $checkBtn = $('#check-questions');
            const $resetBtn = $('#reset-questions');
            const $actions = $('#quiz-actions');

            console.log('=== quiz-actions 鏍峰紡 ===');
            console.log('display:', $actions.css('display'));
            console.log('visibility:', $actions.css('visibility'));
            console.log('opacity:', $actions.css('opacity'));
            console.log('position:', $actions.css('position'));
            console.log('z-index:', $actions.css('z-index'));

            console.log('=== 鎻愪氦绛旀鎸夐挳鏍峰紡 ===');
            console.log('display:', $checkBtn.css('display'));
            console.log('visibility:', $checkBtn.css('visibility'));
            console.log('opacity:', $checkBtn.css('opacity'));
            console.log('width:', $checkBtn.css('width'));
            console.log('height:', $checkBtn.css('height'));
            console.log('background:', $checkBtn.css('background'));
            console.log('position:', $checkBtn.css('position'));
            console.log('top:', $checkBtn.css('top'));
            console.log('left:', $checkBtn.css('left'));
            console.log('transform:', $checkBtn.css('transform'));

            // 鑾峰彇鎸夐挳鐨勫疄闄呬綅缃?
            const checkBtnOffset = $checkBtn.offset();
            console.log('鎸夐挳鍦ㄩ〉闈腑鐨勪綅缃?', checkBtnOffset);
            console.log('鎸夐挳鐨?boundingClientRect:', $checkBtn[0].getBoundingClientRect());

            console.log('=== 閲嶆柊寮€濮嬫寜閽牱寮?===');
            console.log('display:', $resetBtn.css('display'));
            console.log('visibility:', $resetBtn.css('visibility'));
            console.log('opacity:', $resetBtn.css('opacity'));

            // 妫€鏌ユ槸鍚︽湁鍏朵粬鍏冪礌閬尅
            const checkBtnRect = $checkBtn[0].getBoundingClientRect();
            const elementAtPoint = document.elementFromPoint(
                checkBtnRect.left + checkBtnRect.width / 2,
                checkBtnRect.top + checkBtnRect.height / 2
            );
            console.log('=== 鎸夐挳浣嶇疆涓婄殑鍏冪礌 ===');
            console.log('鎸夐挳涓績鐐圭殑鍏冪礌:', elementAtPoint);
            console.log('鏄惁鏄寜閽湰韬?', elementAtPoint === $checkBtn[0] || $checkBtn[0].contains(elementAtPoint));

            // 妯″紡鍒囨崲鍣ㄦ嫋鍔ㄥ姛鑳?
            let isDragging = false;
            let hasMoved = false;
            let dragStartX = 0;
            let dragStartY = 0;
            let elementStartLeft = 0;
            let elementStartTop = 0;
            const $modeSwitcher = $('.mode-switcher');
            const DRAG_THRESHOLD = 5; // 鏈€灏忕Щ鍔ㄨ窛绂伙紙鍍忕礌锛?

            $modeSwitcher.on('mousedown touchstart', function(e) {
                // 濡傛灉鐐瑰嚮鐨勬槸鎸夐挳锛屼笉瑙﹀彂鎷栧姩
                if ($(e.target).hasClass('mode-btn') || $(e.target).closest('.mode-btn').length) {
                    return;
                }

                // 鑾峰彇褰撳墠鍏冪礌鐨勪綅缃?
                const rect = this.getBoundingClientRect();
                elementStartLeft = rect.left;
                elementStartTop = rect.top;

                if (e.type === 'touchstart') {
                    dragStartX = e.touches[0].clientX;
                    dragStartY = e.touches[0].clientY;
                } else {
                    dragStartX = e.clientX;
                    dragStartY = e.clientY;
                    e.preventDefault();
                }

                isDragging = true;
                hasMoved = false;

                console.log('鎸変笅榧犳爣锛岃捣濮嬩綅缃?', {
                    mouseX: dragStartX,
                    mouseY: dragStartY,
                    elementLeft: elementStartLeft,
                    elementTop: elementStartTop
                });
            });

            $(document).on('mousemove touchmove', function(e) {
                if (!isDragging) return;

                let clientX, clientY;
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                // 璁＄畻绉诲姩璺濈
                const deltaX = clientX - dragStartX;
                const deltaY = clientY - dragStartY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                // 鍙湁绉诲姩瓒呰繃闃堝€兼墠寮€濮嬫嫋鍔?
                if (!hasMoved && distance > DRAG_THRESHOLD) {
                    hasMoved = true;
                    $modeSwitcher.addClass('dragging');
                    console.log('寮€濮嬫嫋鍔?);
                }

                if (!hasMoved) return;

                e.preventDefault();

                // 璁＄畻鏂颁綅缃?= 鍏冪礌璧峰浣嶇疆 + 榧犳爣绉诲姩璺濈
                let newLeft = elementStartLeft + deltaX;
                let newTop = elementStartTop + deltaY;

                // 闄愬埗鍦ㄨ鍙ｈ寖鍥村唴
                const switcherWidth = $modeSwitcher.outerWidth();
                const switcherHeight = $modeSwitcher.outerHeight();
                const maxLeft = $(window).width() - switcherWidth;
                const maxTop = $(window).height() - switcherHeight;

                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));

                $modeSwitcher.css({
                    left: newLeft + 'px',
                    top: newTop + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
            });

            $(document).on('mouseup touchend touchcancel', function(e) {
                if (isDragging) {
                    if (hasMoved) {
                        console.log('鎷栧姩缁撴潫');
                    } else {
                        console.log('鍗曞嚮锛堟湭鎷栧姩锛?);
                    }
                    isDragging = false;
                    hasMoved = false;
                    $modeSwitcher.removeClass('dragging');
                }
            });

            // 妯″紡鍒囨崲
            $('.mode-btn').on('click', function() {
                const mode = $(this).data('mode');
                console.log('=== 鍒囨崲妯″紡 ===');
                console.log('鐩爣妯″紡:', mode);
                console.log('褰撳墠妯″紡:', currentMode);
                
                if (currentMode === mode) {
                    console.log('宸茬粡鏄綋鍓嶆ā寮忥紝涓嶉渶瑕佸垏鎹?);
                    return;
                }
                
                currentMode = mode;
                $('.mode-btn').removeClass('active');
                $(this).addClass('active');

                if (mode === 'exam') {
                    console.log('鍒囨崲鍒拌€冭瘯妯″紡');
                    $('#exam-mode').removeClass('active').fadeOut(200, function() {
                        $(this).addClass('active').fadeIn(300);
                    });
                    $('#practice-mode').removeClass('active').hide();
                    $('#quiz-actions').removeClass('hidden').show();
                    console.log('鑰冭瘯妯″紡 - quiz-actions 鏄剧ず鐘舵€?', $('#quiz-actions').is(':visible'));
                } else {
                    console.log('鍒囨崲鍒扮粌涔犳ā寮?);
                    $('#practice-mode').removeClass('active').fadeOut(200, function() {
                        $(this).addClass('active').fadeIn(300);
                        loadFlashcard(currentCardIndex);
                    });
                    $('#exam-mode').removeClass('active').hide();
                    $('#quiz-actions').addClass('hidden').hide();
                    console.log('缁冧範妯″紡 - quiz-actions 鏄剧ず鐘舵€?', $('#quiz-actions').is(':visible'));
                }
            });

            // ==================== 鑰冭瘯妯″紡閫昏緫 ====================
            function updateProgress() {
                const totalQuestions = $('.question-card').length;
                let answeredQuestions = 0;

                $('.question-card').each(function() {
                    if ($(this).find('input:checked').length > 0) answeredQuestions++;
                });

                const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
                $('#progress-fill').css('width', progress + '%');
            }

            function checkQuestion() {
                const questions = $('.question-card');
                const total = questions.length;
                let correct = 0;

                questions.each(function() {
                    const $card = $(this);
                    const questionType = $card.data('question-type');
                    const isSingle = questionType === 'SINGLE' || questionType === 'JUDGE';
                    
                    // 娓呴櫎涔嬪墠鐨勫弽棣?
                    $card.find('.option-feedback').removeClass('show error success warning').empty();
                    $card.find('.option-item').removeClass('option-correct option-incorrect option-correct-highlight option-missed');
                    $card.removeClass('question-correct question-incorrect question-partial');
                    
                    if (isSingle) {
                        const $selected = $card.find('input[type="radio"]:checked');
                        const $correctOption = $card.find('input[data-correct="true"]');
                        
                        if ($selected.length > 0 && $selected.data('correct') === true) {
                            correct += 1;
                            $card.addClass('question-correct');
                            $selected.closest('.option-item').addClass('option-correct');
                            
                            const $optionItem = $selected.closest('.option-item');
                            const explanation = $optionItem.data('option-explanation');
                            if (explanation) {
                                const $feedback = $optionItem.find('.option-feedback');
                                $feedback.addClass('show success')
                                    .html('<i class="fas fa-check-circle"></i> <strong>姝ｇ‘锛?/strong> ' + explanation);
                            }
                        } else {
                            $card.addClass('question-incorrect');
                            
                            if ($selected.length > 0) {
                                $selected.closest('.option-item').addClass('option-incorrect');
                                
                                const $optionItem = $selected.closest('.option-item');
                                const explanation = $optionItem.data('option-explanation');
                                if (explanation) {
                                    const $feedback = $optionItem.find('.option-feedback');
                                    $feedback.addClass('show error')
                                        .html('<i class="fas fa-times-circle"></i> <strong>閿欒锛?/strong> ' + explanation);
                                }
                            }
                            
                            $correctOption.closest('.option-item').addClass('option-correct-highlight');
                            const $correctItem = $correctOption.closest('.option-item');
                            const correctExplanation = $correctItem.data('option-explanation');
                            if (correctExplanation) {
                                const $feedback = $correctItem.find('.option-feedback');
                                $feedback.addClass('show success')
                                    .html('<i class="fas fa-check-circle"></i> <strong>姝ｇ‘绛旀锛?/strong> ' + correctExplanation);
                            }
                            
                            $card.find('.explanation-box').addClass('show');
                        }
                    } else {
                        const $allCorrect = $card.find('input[data-correct="true"]');
                        const correctSelected = $card.find('input[data-correct="true"]:checked').length;
                        const incorrectSelected = $card.find('input[data-correct="false"]:checked').length;
                        
                        $card.find('input').each(function() {
                            const $input = $(this);
                            const $item = $input.closest('.option-item');
                            const isCorrect = $input.data('correct') === true;
                            const isChecked = $input.is(':checked');
                            const explanation = $item.data('option-explanation');
                            
                            if (isChecked) {
                                $item.addClass(isCorrect ? 'option-correct' : 'option-incorrect');
                                
                                if (explanation) {
                                    const $feedback = $item.find('.option-feedback');
                                    if (isCorrect) {
                                        $feedback.addClass('show success')
                                            .html('<i class="fas fa-check-circle"></i> <strong>姝ｇ‘锛?/strong> ' + explanation);
                                    } else {
                                        $feedback.addClass('show error')
                                            .html('<i class="fas fa-times-circle"></i> <strong>閿欒锛?/strong> ' + explanation);
                                    }
                                }
                            } else if (isCorrect) {
                                $item.addClass('option-missed');
                                
                                if (explanation) {
                                    const $feedback = $item.find('.option-feedback');
                                    $feedback.addClass('show warning')
                                        .html('<i class="fas fa-exclamation-triangle"></i> <strong>婕忛€夛紒</strong> ' + explanation);
                                }
                            }
                        });
                        
                        let score = 0;
                        if ($allCorrect.length > 0) {
                            score = (correctSelected / $allCorrect.length) - (incorrectSelected / $allCorrect.length);
                            if (score < 0) score = 0;
                        }
                        
                        correct += score;
                        
                        if (score === 1) {
                            $card.addClass('question-correct');
                        } else if (score > 0) {
                            $card.addClass('question-partial');
                            $card.find('.explanation-box').addClass('show');
                        } else {
                            $card.addClass('question-incorrect');
                            $card.find('.explanation-box').addClass('show');
                        }
                    }
                });

                showScore(correct, total);
            }

            function showScore(correct, total) {
                const score = Math.round((correct / total) * 100);
                $('#score-number').text(score + '%');
                $('#correct-count').text(Math.round(correct * 10) / 10);
                $('#total-count').text(total);

                const $scoreCard = $('#score-display');
                $scoreCard.removeClass('show danger warning');

                if (score >= 80) {
                    $scoreCard.addClass('show');
                    $('#score-text').html('<i class="fas fa-trophy"></i> 浼樼锛佺户缁繚鎸?);
                } else if (score >= 60) {
                    $scoreCard.addClass('show warning');
                    $('#score-text').html('<i class="fas fa-medal"></i> 鑹ソ锛佺户缁姫鍔?);
                } else {
                    $scoreCard.addClass('show danger');
                    $('#score-text').html('<i class="fas fa-times-circle"></i> 闇€瑕佸姞娌癸紒');
                }

                $('html, body').animate({
                    scrollTop: $scoreCard.offset().top - 100
                }, 500);
            }

            function resetQuestions() {
                $('.question-card').removeClass('question-correct question-incorrect question-partial');
                $('.option-item').removeClass('option-correct option-incorrect option-correct-highlight option-missed');
                $('#score-display').removeClass('show danger warning');
                $('input[type="radio"], input[type="checkbox"]').prop('checked', false);
                $('#progress-fill').css('width', '0%');
            }

            $('#check-questions').on('click', checkQuestion);
            $('#reset-questions').on('click', resetQuestions);
            
            // 娴嬭瘯鎸夐挳鐐瑰嚮
            $('#check-questions').on('click', function(e) {
                console.log('=== 鎻愪氦绛旀鎸夐挳琚偣鍑?===');
                console.log('浜嬩欢瀵硅薄:', e);
                console.log('鐩爣鍏冪礌:', e.target);
                console.log('褰撳墠鍏冪礌:', e.currentTarget);
            });
            
            $('#reset-questions').on('click', function(e) {
                console.log('=== 閲嶆柊寮€濮嬫寜閽鐐瑰嚮 ===');
                console.log('浜嬩欢瀵硅薄:', e);
            });
            
            console.log('=== 浜嬩欢缁戝畾瀹屾垚 ===');
            console.log('鎻愪氦绛旀鎸夐挳缁戝畾鐘舵€?', $._data($('#check-questions')[0], 'events'));
            console.log('閲嶆柊寮€濮嬫寜閽粦瀹氱姸鎬?', $._data($('#reset-questions')[0], 'events'));
            
            $(document).on('change', 'input[type="radio"], input[type="checkbox"]', updateProgress);
            
            $(document).on('click', '.option-item', function(e) {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                    const $input = $(this).find('input');
                    if ($input.attr('type') === 'radio') {
                        $input.prop('checked', true);
                    } else {
                        $input.prop('checked', !$input.prop('checked'));
                    }
                    updateProgress();
                }
            });

            $('#total-count').text($('.question-card').length);
            
            console.log('=== 鍒濆鍖栧畬鎴?===');
            console.log('棰樼洰鎬绘暟:', $('.question-card').length);
            console.log('褰撳墠妯″紡:', currentMode);
            console.log('椤甸潰鍔犺浇瀹屾垚');

            // ==================== 缁冧範妯″紡閫昏緫 ====================
            function initializePracticeMode() {
                $('#total-cards').text(QUIZ_DATA.length);
                practiceStats.answered = new Array(QUIZ_DATA.length).fill(null);
            }

            function loadFlashcard(index) {
                if (index < 0 || index >= QUIZ_DATA.length) return;

                const question = QUIZ_DATA[index];
                currentCardIndex = index;
                isFlipped = false;

                $('#flashcard').removeClass('flipped');
                $('#submit-answer').show();
                $('#flip-card').removeClass('show');
                $('#hint-text').text('閫夋嫨绛旀鍚庣偣鍑?鎻愪氦绛旀"');

                $('#current-card').text(index + 1);

                const typeMap = {
                    'SINGLE': { text: '鍗曢€?, class: 'single' },
                    'MULTI': { text: '澶氶€?, class: 'multi' },
                    'JUDGE': { text: '鍒ゆ柇', class: 'judge' }
                };
                const typeInfo = typeMap[question.type] || typeMap['SINGLE'];
                
                // 灏嗛鍨嬫爣绛惧祵鍏ュ埌棰樼洰涓紝骞舵坊鍔犲紩鐢ㄤ緷鎹寜閽?
                const typeLabel = `<span class="question-type-inline ${typeInfo.class}">${typeInfo.text}</span>`;
                let questionHtml = typeLabel + question.content;
                
                // 濡傛灉鏈夊紩鐢ㄤ緷鎹紝娣诲姞鎸夐挳
                if (question.reference) {
                    const safeReference = question.reference.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                    questionHtml += `<span class="reference-btn" data-reference="${safeReference}">
                        <i class="fas fa-book"></i>
                    </span>`;
                }
                
                $('#card-question').html(questionHtml);
                
                // 涓哄紩鐢ㄦ寜閽坊鍔?hover 浜嬩欢
                $('.reference-btn').off('mouseenter mouseleave').on('mouseenter', function(e) {
                    const $btn = $(this);
                    const reference = $btn.attr('data-reference');
                    
                    // 鍒涘缓 tooltip
                    const $tooltip = $('<div class="reference-tooltip show"></div>').text(reference);
                    $('body').append($tooltip);
                    
                    // 璁＄畻浣嶇疆
                    const btnRect = $btn[0].getBoundingClientRect();
                    const tooltipWidth = $tooltip.outerWidth();
                    const tooltipHeight = $tooltip.outerHeight();
                    
                    let top = btnRect.top - tooltipHeight - 16;
                    let left = btnRect.left + (btnRect.width / 2) - (tooltipWidth / 2);
                    
                    // 妫€鏌ユ槸鍚﹁秴鍑鸿鍙?
                    if (top < 10) {
                        // 鏄剧ず鍦ㄤ笅鏂?
                        top = btnRect.bottom + 16;
                        $tooltip.addClass('bottom');
                    }
                    
                    if (left < 10) {
                        left = 10;
                    } else if (left + tooltipWidth > $(window).width() - 10) {
                        left = $(window).width() - tooltipWidth - 10;
                    }
                    
                    $tooltip.css({
                        top: top + 'px',
                        left: left + 'px'
                    });
                    
                    // 淇濆瓨 tooltip 寮曠敤
                    $btn.data('tooltip', $tooltip);
                }).on('mouseleave', function() {
                    const $btn = $(this);
                    const $tooltip = $btn.data('tooltip');
                    if ($tooltip) {
                        $tooltip.remove();
                        $btn.removeData('tooltip');
                    }
                });

                const $options = $('#card-options');
                $options.empty();
                question.options.forEach(option => {
                    const $li = $('<li>')
                        .addClass('flashcard-option')
                        .attr('data-label', option.label)
                        .attr('data-correct', option.isCorrect)
                        .html(`
                            <div class="flashcard-option-label">${option.label}</div>
                            <div class="flashcard-option-text">${option.content}</div>
                        `);
                    $options.append($li);
                });

                const correctOptions = question.options.filter(o => o.isCorrect);
                const answerText = correctOptions.map(o => `<strong>${o.label}.</strong> ${o.content}`).join('<br><br>');
                $('#answer-content').html(answerText);

                let explanationHtml = '';
                if (question.generalExplanation) {
                    explanationHtml = question.generalExplanation;
                }
                
                const optionExplanations = question.options
                    .filter(o => o.explanation)
                    .map(o => `<strong>${o.label}.</strong> ${o.explanation}`)
                    .join('<br><br>');
                
                if (optionExplanations) {
                    if (explanationHtml) explanationHtml += '<br><br>';
                    explanationHtml += optionExplanations;
                }

                if (explanationHtml) {
                    $('#card-explanation').show();
                    $('#explanation-content').html(explanationHtml);
                } else {
                    $('#card-explanation').hide();
                }

                $('#prev-card').prop('disabled', index === 0);
                $('#next-card').prop('disabled', index === QUIZ_DATA.length - 1);
            }

            $(document).on('click', '.flashcard-option', function() {
                if ($(this).hasClass('disabled')) return;

                const question = QUIZ_DATA[currentCardIndex];
                const $option = $(this);

                if (question.type === 'MULTI') {
                    $option.toggleClass('selected');
                } else {
                    $('.flashcard-option').removeClass('selected');
                    $option.addClass('selected');
                }
            });

            $('#submit-answer').on('click', function() {
                const selectedOptions = $('.flashcard-option.selected');
                if (selectedOptions.length === 0) {
                    alert('璇峰厛閫夋嫨绛旀锛?);
                    return;
                }

                $('.flashcard-option').addClass('disabled');
                $(this).hide();
                $('#flip-card').addClass('show');
                $('#hint-text').text('鐐瑰嚮"鏌ョ湅璇﹁В"缈昏浆鍗＄墖');

                const userAnswer = selectedOptions.map(function() {
                    return $(this).attr('data-label');
                }).get();

                const question = QUIZ_DATA[currentCardIndex];
                $('.flashcard-option').each(function() {
                    const $opt = $(this);
                    const isCorrect = $opt.attr('data-correct') === 'true';
                    const isSelected = $opt.hasClass('selected');
                    
                    if (isSelected && isCorrect) {
                        $opt.addClass('correct');
                        $opt.append('<i class="fas fa-check-circle flashcard-option-icon"></i>');
                    } else if (isSelected && !isCorrect) {
                        $opt.addClass('incorrect');
                        $opt.append('<i class="fas fa-times-circle flashcard-option-icon"></i>');
                    } else if (!isSelected && isCorrect) {
                        $opt.addClass('missed');
                        $opt.append('<i class="fas fa-exclamation-circle flashcard-option-icon"></i>');
                    }
                });

                recordAnswer(userAnswer);
            });

            $('#flip-card').on('click', function() {
                $('#flashcard').toggleClass('flipped');
                isFlipped = !isFlipped;
            });

            $('#back-to-question').on('click', function() {
                $('#flashcard').removeClass('flipped');
                isFlipped = false;
            });

            $('#prev-card').on('click', function() {
                if (currentCardIndex > 0) {
                    loadFlashcard(currentCardIndex - 1);
                }
            });

            $('#next-card').on('click', function() {
                if (currentCardIndex < QUIZ_DATA.length - 1) {
                    loadFlashcard(currentCardIndex + 1);
                } else {
                    showPracticeComplete();
                }
            });

            function recordAnswer(userAnswer) {
                const question = QUIZ_DATA[currentCardIndex];
                const correctAnswers = question.options
                    .filter(o => o.isCorrect)
                    .map(o => o.label)
                    .sort();
                const isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswers);

                if (practiceStats.answered[currentCardIndex] === null) {
                    if (isCorrect) {
                        practiceStats.correct++;
                    } else {
                        practiceStats.incorrect++;
                    }
                }

                practiceStats.answered[currentCardIndex] = userAnswer;
                updatePracticeStats();
            }

            function updatePracticeStats() {
                $('#practice-correct-mini').text(practiceStats.correct);
                $('#practice-incorrect-mini').text(practiceStats.incorrect);
            }

            function showPracticeComplete() {
                $('.flashcard-container, .practice-header').hide();
                $('#practice-complete').fadeIn(500);

                $('#final-correct').text(practiceStats.correct);
                $('#final-incorrect').text(practiceStats.incorrect);
                
                const total = QUIZ_DATA.length;
                const accuracy = total > 0 ? Math.round((practiceStats.correct / total) * 100) : 0;
                $('#final-accuracy').text(accuracy + '%');
            }

            $('#restart-practice').on('click', function() {
                practiceStats = { correct: 0, incorrect: 0, answered: new Array(QUIZ_DATA.length).fill(null) };
                currentCardIndex = 0;
                updatePracticeStats();

                $('#practice-complete').hide();
                $('.flashcard-container, .practice-header').show();
                loadFlashcard(0);
            });
        });
