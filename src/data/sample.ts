import { Deck, Card } from '@/types';
import { INITIAL_LEARNING_STATE } from '@/lib/srs';

const createCard = (
    id: string,
    stem: string,
    options: string[],
    correctIndex: number,
    explanation?: string,
    imageUrl?: string
): Card => {
    return {
        id,
        stem,
        imageUrl,
        explanation,
        options: options.map((text, i) => ({ id: `${id}_${i}`, text })),
        correctOptionId: `${id}_${correctIndex}`,
        learningState: { ...INITIAL_LEARNING_STATE },
    };
};

export const SAMPLE_DECK: Deck = {
    id: 'deck_101',
    title: 'Đề thi Tốt nghiệp THPT 2024 - Mã đề 101',
    subject: 'Vật Lí',
    timeLimit: 50,
    isReadOnly: true,
    year: 2024,
    cards: [
        createCard(
            'q1',
            'Một vật dao động điều hòa với tần số góc ω. Chu kì dao động của vật được tính bằng công thức nào sau đây?',
            ['T = 2πω', 'T = ω/2π', 'T = 2π/ω', 'T = πω'],
            2,
            'Công thức chu kì dao động điều hòa là T = 2π/ω.'
        ),
        createCard(
            'q2',
            'Đặt điện áp xoay chiều u = U₀cos(ωt) vào hai đầu đoạn mạch chỉ có tụ điện. So với cường độ dòng điện trong mạch, điện áp giữa hai đầu đoạn mạch',
            ['trễ pha π/2', 'sớm pha π/2', 'cùng pha', 'ngược pha'],
            0,
            'Trong mạch chỉ có tụ điện, điện áp trễ pha π/2 so với dòng điện.'
        ),
        createCard(
            'q3',
            'Hạt nhân nào sau đây có thể phân hạch?',
            ['Heli (He)', 'Cacbon (C)', 'Urani (U)', 'Nitơ (N)'],
            2,
            'Urani (U-235) là hạt nhân nặng, có thể phân hạch.'
        ),
        createCard(
            'q4',
            'Trong chân không, sóng điện từ có bước sóng nào sau đây là sóng vô tuyến?',
            ['60 m', '0,6 µm', '6 nm', '6 pm'],
            0,
            'Sóng vô tuyến có bước sóng từ vài mét đến vài km. 60m thuộc vùng sóng ngắn.'
        ),
        createCard(
            'q5',
            'Một con lắc lò xo gồm lò xo nhẹ và vật nhỏ có khối lượng m đang dao động điều hòa. Khi vật có vận tốc v thì động năng của con lắc là',
            ['mv²', '1/2 mv²', 'mv', '1/2 mv'],
            1,
            'Động năng Wđ = 1/2 mv².'
        ),
        createCard(
            'q6',
            'Hình vẽ bên mô tả thí nghiệm về hiện tượng nào của ánh sáng?',
            ['Khúc xạ ánh sáng', 'Phản xạ ánh sáng', 'Tán sắc ánh sáng', 'Giao thoa ánh sáng'],
            2,
            'Hình ảnh lăng kính phân tích chùm sáng trắng thành dải màu cầu vồng là hiện tượng Tán sắc ánh sáng.',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Light_dispersion_of_a_mercury-vapor_lamp_with_a_flint_glass_prism.jpg/440px-Light_dispersion_of_a_mercury-vapor_lamp_with_a_flint_glass_prism.jpg'
        ),],
};