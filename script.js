document.addEventListener('DOMContentLoaded', () => {

    // HTMLの各要素を取得
    const inputX = document.getElementById('inputX');
    const inputY = document.getElementById('inputY');
    const ratioShield = document.getElementById('ratioShield');
    const ratioSpear = document.getElementById('ratioSpear');
    const ratioBow = document.getElementById('ratioBow');
    
    const calculateButton = document.getElementById('calculateButton');
    
    // 結果表示用の要素
    const resultShield = document.getElementById('resultShield');
    const resultSpear = document.getElementById('resultSpear');
    const resultBow = document.getElementById('resultBow');
    const resultTotal = document.getElementById('resultTotal'); 
    const errorMessage = document.getElementById('errorMessage');

    // 「ざっくり計算」用の要素
    const zakkuriToggle = document.getElementById('zakkuriToggle');
    const zakkuriStatus = document.getElementById('zakkuriStatus');
    const zakkuriOptions = document.getElementById('zakkuriOptions');
    const resultZakkuri = document.getElementById('resultZakkuri');


    // ざっくり計算 (ON/OFF) の制御
    zakkuriToggle.addEventListener('change', () => {
        if (zakkuriToggle.checked) {
            zakkuriStatus.textContent = 'ON';
            zakkuriStatus.style.color = '#5e42a6';
            zakkuriOptions.style.display = 'grid';
        } else {
            zakkuriStatus.textContent = 'OFF';
            zakkuriStatus.style.color = '#888';
            zakkuriOptions.style.display = 'none';
        }
    });


    // 「計算する」ボタンがクリックされたときの処理
    calculateButton.addEventListener('click', () => {
        
        errorMessage.textContent = '';
        
        // 入力欄から値を取得
        const x_val = inputX.value;
        const y_val = inputY.value;
        const rShield = parseFloat(ratioShield.value);
        const rSpear = parseFloat(ratioSpear.value);
        const rBow = parseFloat(ratioBow.value);
        
        // --- ★★★ エラーチェック ★★★ ---
        
        // (1) NaNチェック
        // parseFloatは "123abc" を 123 と読んでしまうため、
        // 入力値 (value) と parseFloat(value) が一致するかで厳密にチェック
        const x_num = parseFloat(x_val);
        const y_num = parseFloat(y_val);

        if (isNaN(x_num) || isNaN(y_num) || isNaN(rShield) || isNaN(rSpear) || isNaN(rBow) ||
            x_val !== String(x_num) || y_val !== String(y_num) ) {
            errorMessage.textContent = 'エラー：有効な数値を入力してください';
            return; 
        }

        // (2) 整数かどうかのチェック
        if (!Number.isInteger(x_num) || !Number.isInteger(y_num)) {
            errorMessage.textContent = 'エラー：整数で入力してください';
            return;
        }
        
        // (3) x, y がマイナスでないか
        if (x_num < 0 || y_num < 0) {
            errorMessage.textContent = 'エラー：マイナスの値は入力できません';
            return;
        }

        // (4) ゼロ除算のチェック
        if (y_num === 0) {
            errorMessage.textContent = '参加人数0人...(´･ω･`)';
            return;
        }

        // (5) 割合のマイナス値チェック
        if (rShield < 0 || rSpear < 0 || rBow < 0) {
            errorMessage.textContent = 'エラー：マイナスの値は入力できません';
            return;
        }
        
        // (6) 割合合計の浮動小数点対策
        const totalRatio = rShield + rSpear + rBow;
        // 100 との差が 0.001 より大きい場合（99.999 や 100.001 ではない場合）にエラー
        if (Math.abs(totalRatio - 100) > 0.001) { 
            errorMessage.textContent = `エラー: 必ず 100 % にしてください`;
            return;
        }
        
        // --- ★★★ エラーチェックここまで ★★★ ---


        // --- 正常な計算 ---
        const x = x_num;
        const y = y_num;

        const shieldFloat = (x * (rShield / 100)) / y;
        const spearFloat = (x * (rSpear / 100)) / y;
        const bowFloat = (x * (rBow / 100)) / y;

        const shieldFinal = Math.floor(shieldFloat);
        const spearFinal = Math.floor(spearFloat);
        const bowFinal = Math.floor(bowFloat);
        
        const totalFinal = shieldFinal + spearFinal + bowFinal;
        
        // (1) 元のロジックの「余り」を計算
        const totalUsed = totalFinal * y;
        const remainder = x - totalUsed;
        
        
        // --- ざっくり計算ロジック ---
        let displayTotal = totalFinal; 
        let zakkuriRemainder = 0;   

        let displayShield = shieldFinal;
        let displaySpear = spearFinal;
        let displayBow = bowFinal;
        
        if (zakkuriToggle.checked) {
            // ONの場合
            const placeValueInput = document.querySelector('input[name="zakkuriPlace"]:checked');
            
            if (placeValueInput) {
                const placeValue = parseFloat(placeValueInput.value);
                
                zakkuriRemainder = totalFinal % placeValue;
                displayTotal = totalFinal - zakkuriRemainder;

                // 盾槍弓の再分配
                // 割合の合計が100%なので、rShield + rSpear + rBow = 100
                displayShield = Math.floor(displayTotal * (rShield / 100));
                displaySpear = Math.floor(displayTotal * (rSpear / 100));
                
                // 弓は「残り全部」
                displayBow = displayTotal - displayShield - displaySpear;
            }
        }
        
        // (3) 2種類の「余り」を合算
        const finalCombinedRemainder = zakkuriRemainder*y + remainder;

        
        // --- 結果を各要素に個別に設定 ---
        resultShield.textContent = displayShield;
        resultSpear.textContent = displaySpear;
        resultBow.textContent = displayBow;
        resultTotal.textContent = displayTotal;
        resultZakkuri.textContent = finalCombinedRemainder;
    });
});
