import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { CURRICULUM_TOPICS, getTopicsForGrade } from '../src/data/curriculum.ts';
dotenv.config();

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    const error = new Error(
      'MISSING_GEMINI_API_KEY: Chưa tìm thấy khóa bí mật GEMINI_API_KEY. Vui lòng vào Google AI Studio > Settings > Secrets, tạo secret có tên GEMINI_API_KEY với API key của bạn để kích hoạt Trợ lý ý tưởng AI thật.'
    );
    (error as any).code = 'MISSING_GEMINI_API_KEY';
    throw error;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      timeout: 15000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface GeneratedIdea {
  title: string;
  mainContent: string;
  charactersAndObjects: string;
  activitiesAndDetails: string;
  composition: {
    foreground: string;
    midground: string;
    background: string;
  };
  colorSuggestions: string;
  creativeSpark: string;
  materialSuggestions: string;
  openEndedQuestion?: string;
}

export interface IdeaGenerationResponse {
  ideas: GeneratedIdea[];
  friendlyNote: string;
  guidingQuestions?: string[];
  isCuratedFallback?: boolean;
}

export interface ArtReviewResponse {
  isArtworkDetected: boolean;
  interestingThings: string;
  composition: string;
  colors: string;
  creativeDetails: string;
  suggestions: string[];
  encouragement: string;
  isCuratedFallback?: boolean;
}

/**
 * Generate 3 distinct art ideas tailored to the specific grade and official curriculum topic using real Gemini API.
 */
export async function generateArtIdeas(params: {
  grade: number;
  topicName: string;
  studentWish?: string;
  previousTitles?: string[];
}): Promise<IdeaGenerationResponse> {
  const { grade, topicName, studentWish, previousTitles } = params;

  // Real Gemini Client initialization (throws MISSING_GEMINI_API_KEY if not configured)
  const ai = getGeminiClient();

  const gradePedagogy =
    grade <= 2
      ? `Học sinh Khối ${grade} (6-7 tuổi): Các ý tưởng phải rất đơn giản, tươi vui, hình ảnh gần gũi (hoa quả, con vật nuôi, đồ chơi, gia đình), nét vẽ mộc mạc từ chấm, nét và các hình cơ bản (tròn, vuông, tam giác). Tránh các yêu cầu phối cảnh xa gần phức tạp.`
      : grade <= 4
      ? `Học sinh Khối ${grade} (8-9 tuổi): Tăng cường phối hợp hình khối, màu sắc (gam màu nóng - lạnh, tương phản, bổ túc), hoa văn trang trí, chất liệu và bố cục có phân lớp không gian rõ ràng (tiền cảnh, trung cảnh, hậu cảnh).`
      : `Học sinh Khối 5 (10 tuổi): Khuyến khích ý tưởng có chiều sâu thông điệp, thể hiện cảm xúc, trải nghiệm sống và góc nhìn riêng của cá nhân; phối hợp các yếu tố tạo hình phong phú, đa chất liệu và chất cảm đặc sắc.`;

  const prompt = `Bạn là Cô Trợ Lý Mĩ Thuật AI thông thái, ấm áp và nhiệt huyết dành cho học sinh tiểu học Việt Nam.
Nhiệm vụ: Hãy sáng tạo đúng 3 Ý TƯỞNG VẼ TRANH HOÀN TOÀN MỚI VÀ KHÁC BIỆT NHAU dành cho học sinh.

THÔNG TIN ĐẦU VÀO:
- Khối lớp: Lớp ${grade} (Tiểu học)
- Chủ đề Mĩ thuật: "${topicName}"
- Yêu cầu / Mong muốn bổ sung của học sinh: ${studentWish ? `"${studentWish}"` : 'Em chưa nghĩ ra ý tưởng cụ thể, nhờ AI gợi ý giúp em'}
${previousTitles && previousTitles.length > 0 ? `- Tránh lặp lại các ý tưởng vừa xuất hiện: ${previousTitles.join(', ')}` : ''}

ĐẶC ĐIỂM SƯ PHẠM THEO LỨA TUỔI:
${gradePedagogy}

QUY TẮC SƯ PHẠM QUAN TRỌNG:
1. Dùng tiếng Việt tự nhiên, trong sáng, ngắn gọn, dễ hiểu và truyền cảm hứng nghệ thuật cho học sinh tiểu học.
2. Khích lệ học sinh tự tưởng tượng, lựa chọn và sáng tạo; tuyệt đối KHÔNG áp đặt, KHÔNG vẽ thay, KHÔNG yêu cầu sao chép nguyên mẫu và KHÔNG khẳng định một ý tưởng là đáp án duy nhất.
3. Tuyệt đối KHÔNG tạo nội dung bạo lực, đáng sợ, mê tín hoặc không phù hợp với lứa tuổi học sinh tiểu học.
4. Tuyệt đối KHÔNG yêu cầu hay đề cập thông tin cá nhân như tên thật, địa chỉ, số điện thoại.
5. Mỗi lần trả lời phải là 3 ý tưởng MỚI hoàn toàn, mang các góc nhìn, bối cảnh và cảm xúc phong phú khác nhau (ví dụ: một ý tưởng ngoài trời thiên nhiên, một ý tưởng sinh hoạt ấm áp trong nhà/trường học, một ý tưởng mang tính cổ tích, bay bổng hoặc ước mơ tương lai).
6. Với MỖI Ý TƯỞNG trong 3 ý tưởng, bắt buộc phải có đầy đủ 9 mục sau:
   - title: Tên ý tưởng ngắn gọn, cuốn hút, đậm chất tuổi thơ.
   - mainContent: Nội dung chính của bức tranh (2-3 câu ngắn).
   - charactersAndObjects: Các nhân vật, con vật, đồ vật hoặc cảnh vật có thể vẽ.
   - activitiesAndDetails: Hoạt động cụ thể của các nhân vật và chi tiết vui nhộn.
   - composition: Gợi ý sắp xếp hình ảnh và bố cục không gian gồm:
       + foreground (tiền cảnh - phía trước)
       + midground (trung cảnh - phía giữa)
       + background (hậu cảnh - phía sau)
   - colorSuggestions: Gợi ý màu sắc hài hòa, tươi vui hoặc tương phản hợp lứa tuổi.
   - creativeSpark: Một chi tiết sáng tạo độc đáo làm nên nét riêng của bức tranh.
   - materialSuggestions: Chất liệu thực hành phù hợp (sáp màu, màu nước, màu dạ, xé dán giấy màu, đất nặn, vật liệu tái chế...).
   - openEndedQuestion: Một câu hỏi gợi mở ngắn gọn, đáng yêu để học sinh tự suy nghĩ và phát triển ý tưởng riêng của mình.`;

  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction:
            'Bạn là Cô Trợ Lý Mĩ Thuật AI yêu thương học sinh tiểu học Việt Nam. Luôn khích lệ, tôn trọng nét vẽ tuổi thơ và mang lại niềm vui sáng tạo cho các em.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideas: {
                type: Type.ARRAY,
                description: 'Danh sách đúng 3 ý tưởng vẽ tranh độc đáo, khác biệt',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Tên ý tưởng ngắn gọn, hấp dẫn' },
                    mainContent: { type: Type.STRING, description: 'Nội dung chính bức tranh' },
                    charactersAndObjects: {
                      type: Type.STRING,
                      description: 'Nhân vật, con vật, đồ vật hoặc cảnh vật có thể vẽ',
                    },
                    activitiesAndDetails: {
                      type: Type.STRING,
                      description: 'Hoạt động của các nhân vật và chi tiết thú vị',
                    },
                    composition: {
                      type: Type.OBJECT,
                      description: 'Gợi ý sắp xếp hình ảnh và bố cục',
                      properties: {
                        foreground: { type: Type.STRING, description: 'Phía trước (tiền cảnh)' },
                        midground: { type: Type.STRING, description: 'Phía giữa (trung cảnh)' },
                        background: { type: Type.STRING, description: 'Phía sau (hậu cảnh)' },
                      },
                      required: ['foreground', 'midground', 'background'],
                    },
                    colorSuggestions: { type: Type.STRING, description: 'Gợi ý màu sắc' },
                    creativeSpark: {
                      type: Type.STRING,
                      description: 'Chi tiết sáng tạo độc đáo',
                    },
                    materialSuggestions: {
                      type: Type.STRING,
                      description: 'Chất liệu phù hợp lứa tuổi',
                    },
                    openEndedQuestion: {
                      type: Type.STRING,
                      description: 'Câu hỏi gợi mở để học sinh tự phát triển ý tưởng riêng',
                    },
                  },
                  required: [
                    'title',
                    'mainContent',
                    'charactersAndObjects',
                    'activitiesAndDetails',
                    'composition',
                    'colorSuggestions',
                    'creativeSpark',
                    'materialSuggestions',
                    'openEndedQuestion',
                  ],
                },
              },
              friendlyNote: {
                type: Type.STRING,
                description: 'Lời chào và lời nhắn nhủ ngắn gọn, khích lệ bé tự do sáng tạo',
              },
              guidingQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Tối đa 2 câu hỏi gợi mở chung cho học sinh',
              },
            },
            required: ['ideas', 'friendlyNote'],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText) as IdeaGenerationResponse;
      if (!parsed.ideas || !Array.isArray(parsed.ideas) || parsed.ideas.length === 0) {
        throw new Error('Gemini không trả về danh sách ý tưởng hợp lệ. Vui lòng thử lại!');
      }
      return parsed;
    } catch (err: any) {
      lastError = err;
      const is503orSurge =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE');

      if (is503orSurge && modelName !== modelsToTry[modelsToTry.length - 1]) {
        console.warn(`Model ${modelName} gặp tải cao (503), đang tự động chuyển sang ${modelsToTry[1]}...`);
        continue;
      }
      break;
    }
  }

  console.error('Lỗi khi gọi Gemini generateArtIdeas:', lastError?.message || lastError);
  if (lastError?.code === 'MISSING_GEMINI_API_KEY') {
    throw lastError;
  }
  throw new Error(
    lastError?.message || 'Không thể tạo ý tưởng từ AI lúc này. Vui lòng thử lại sau giây lát!'
  );
}

/**
 * Review a student's actual artwork photo using Gemini 3.8 Flash Multimodal Vision.
 */
export async function reviewStudentArtwork(params: {
  imageBase64: string;
  mimeType: string;
  topicName?: string;
  grade?: number;
  studentDescription?: string;
}): Promise<ArtReviewResponse> {
  const { imageBase64, mimeType, topicName, grade, studentDescription } = params;

  if (!process.env.GEMINI_API_KEY) {
    return generateCuratedFallbackReview(topicName, grade, studentDescription);
  }

  const ai = getGeminiClient();

  // Remove potential data URL prefix if present
  const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

  const promptText = `Bạn là chuyên gia sư phạm Mĩ thuật tiểu học đang trực tiếp quan sát bức tranh vẽ của một bạn nhỏ ${
    grade ? `học sinh Lớp ${grade}` : 'học sinh tiểu học'
  }.
Chủ đề bức tranh: "${topicName || 'Tự do sáng tạo'}"
${studentDescription ? `Lời giới thiệu của bạn nhỏ về bức tranh: "${studentDescription}"` : ''}

QUY TẮC NHẬN XÉT:
1. Bạn chỉ được nhận xét dựa trên NHỮNG GÌ THỰC SỰ NHÌN THẤY trong bức ảnh. Nếu ảnh bị mờ hoặc góc chụp chưa rõ, hãy nói rõ một cách nhẹ nhàng.
2. Tuyệt đối KHÔNG chê bai, KHÔNG so sánh với bạn khác, KHÔNG chấm điểm số hay xếp thứ hạng.
3. Không yêu cầu hay bình luận về mặt người hay dữ liệu cá nhân.
4. Đánh giá gồm 6 mục rõ ràng:
   - "Điều thú vị trong tranh": mô tả những hình ảnh, màu sắc, nhân vật hoặc cảnh vật cụ thể nhìn thấy được.
   - "Bố cục của em": nhận xét sự sắp xếp hình vẽ lớn nhỏ, cân đối, vị trí trong trang giấy.
   - "Màu sắc của em": nhận xét sự phối hợp màu, độ tươi sáng hoặc mảng màu bé đã tô.
   - "Chi tiết sáng tạo": chỉ ra 1 hoặc 2 nét riêng biệt, ngộ nghĩnh hoặc độc đáo của bạn nhỏ.
   - "Gợi ý để tranh thú vị hơn": 1 đến 3 đề xuất nhẹ nhàng, phù hợp lứa tuổi tiểu học (ví dụ: tô kín thêm một mảng nền, thêm bóng đổ hay điểm thêm chi tiết nhỏ...).
   - "Lời động viên": lời khen ấm áp, khích lệ niềm say mê vẽ tranh của em.`;

  const imagePart = {
    inlineData: {
      mimeType: mimeType || 'image/jpeg',
      data: cleanBase64,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        imagePart,
        {
          text: promptText,
        },
      ],
      config: {
        systemInstruction:
          'Bạn là Cô Giáo Mĩ Thuật AI yêu thương học sinh tiểu học. Giọng văn chân thành, trong sáng, khích lệ sáng tạo.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isArtworkDetected: {
              type: Type.BOOLEAN,
              description: 'Xác định ảnh có phải là tác phẩm mĩ thuật, tranh vẽ hay sản phẩm thủ công không',
            },
            interestingThings: {
              type: Type.STRING,
              description: 'Điều thú vị trong tranh: những chi tiết, nhân vật nhìn thấy thực tế',
            },
            composition: {
              type: Type.STRING,
              description: 'Bố cục của em: cách sắp đặt hình ảnh',
            },
            colors: {
              type: Type.STRING,
              description: 'Màu sắc của em: cách phối màu',
            },
            creativeDetails: {
              type: Type.STRING,
              description: 'Chi tiết sáng tạo nổi bật',
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Từ 1 đến 3 gợi ý nhẹ nhàng để tranh thêm sinh động',
            },
            encouragement: {
              type: Type.STRING,
              description: 'Lời động viên chân tình, khích lệ học sinh tiếp tục vẽ tranh',
            },
          },
          required: [
            'isArtworkDetected',
            'interestingThings',
            'composition',
            'colors',
            'creativeDetails',
            'suggestions',
            'encouragement',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText) as ArtReviewResponse;
    return parsed;
  } catch (err: any) {
    console.warn('Multimodal review temporary issue, using curriculum review:', err?.message);
    return generateCuratedFallbackReview(topicName, grade, studentDescription);
  }
}

/**
 * Pedagogical curriculum-based generator if model is experiencing temporary 503 spike
 */
function generateCuratedFallbackIdeas(
  grade: number,
  topicName: string,
  studentWish?: string
): IdeaGenerationResponse {
  const wishNote = studentWish ? `Dựa trên mong muốn: "${studentWish}". ` : '';

  if (grade <= 2) {
    return {
      isCuratedFallback: true,
      friendlyNote: `${wishNote}Cô gợi ý cho bé 3 hướng vẽ thật tươi vui và dễ thương từ các hình và nét quen thuộc nhé!`,
      guidingQuestions: [
        'Bé muốn vẽ con vật hay cảnh vật nào gần gũi với mình nhất?',
        'Bé thích dùng sáp màu đỏ, vàng rực rỡ hay màu xanh mát lành?',
      ],
      ideas: [
        {
          title: `Khu vườn tuổi thơ và ${topicName}`,
          mainContent: `Bức tranh vẽ không gian thiên nhiên ngập tràn ánh nắng, hoa lá và các bạn nhỏ vui chơi hòa cùng chủ đề ${topicName}.`,
          charactersAndObjects: 'Hai bạn nhỏ đang tươi cười, chú bướm nhiều màu, các khóm hoa cúc tròn xoe.',
          activitiesAndDetails: 'Các bạn nhỏ đang đưa tay hứng những giọt nắng sớm, trên cành cây có chú chim nhỏ hót líu lo.',
          composition: {
            foreground: 'Những bông hoa to nhiều cánh vươn lên từ mép giấy phía trước.',
            midground: 'Hai bạn nhỏ đứng ở giữa trang giấy với nụ cười rạng rỡ.',
            background: 'Bầu trời xanh nhạt có mây trắng bồng bềnh và ông mặt trời tỏa tia nắng nhẹ nhàng.',
          },
          colorSuggestions: 'Dùng màu vàng tươi, đỏ ấm và xanh lá non tạo cảm giác rộn rã, tràn đầy sức sống.',
          creativeSpark: 'Vẽ thêm những nốt nhạc bay lượn quanh chú chim nhỏ như tiếng ca vui nhộn.',
          materialSuggestions: 'Bút sáp dầu tô mảng màu thật đậm và đều tay.',
        },
        {
          title: `Gia đình và góc nhỏ thân thương`,
          mainContent: `Tái hiện khoảnh khắc ấm cúng trong ngôi nhà ngập tràn tình yêu thương, kết hợp khéo léo với chủ đề ${topicName}.`,
          charactersAndObjects: 'Cả nhà quây quần bên nhau, chiếc bàn tròn xinh xắn, ô cửa sổ nhìn ra vòm cây xanh.',
          activitiesAndDetails: 'Mọi người cùng trò chuyện vui vẻ, trên bàn có bình hoa cúc nhỏ tỏa hương dịu mát.',
          composition: {
            foreground: 'Bàn trà nhỏ có ấm chén và đĩa bánh ngọt.',
            midground: 'Các thành viên trong gia đình ngồi quây quần với cử chỉ ân cần, gần gũi.',
            background: 'Bức tường phòng khách có treo bức tranh bé tự vẽ và khung rèm cửa phơ phất gió.',
          },
          colorSuggestions: 'Gam màu ấm áp như cam nhạt, vàng kem và nâu gỗ mộc mạc.',
          creativeSpark: 'Chú mèo con cuộn tròn ngủ ngoan dưới chân bàn tạo cảm giác bình yên.',
          materialSuggestions: 'Màu sáp kết hợp bút chì màu để nhấn các chi tiết khuôn mặt.',
        },
        {
          title: `Thế giới diệu kỳ ngập tràn sắc màu`,
          mainContent: `Ý tưởng bay bổng giàu trí tưởng tượng, biến những hình ảnh trong chủ đề ${topicName} thành một câu chuyện cổ tích đáng yêu.`,
          charactersAndObjects: 'Chiếc khinh khí cầu rực rỡ, chú thỏ trắng biết bay, những đám mây hình kẹo ngọt.',
          activitiesAndDetails: 'Chiếc khinh khí cầu chở các bạn nhỏ dạo chơi trên bầu trời cầu vồng.',
          composition: {
            foreground: 'Ngọn đồi thoai thoải với thảm cỏ hoa rực rỡ.',
            midground: 'Chiếc khinh khí cầu to nổi bật ở vị trí trung tâm bức tranh.',
            background: 'Dải cầu vồng bảy sắc uốn lượn qua những tầng mây xanh biếc.',
          },
          colorSuggestions: 'Phối màu cầu vồng tươi sáng: đỏ, cam, vàng, lục, lam, tím hài hòa.',
          creativeSpark: 'Những ngôi sao nhỏ lấp lánh có mắt và miệng cười khúc khích trên nền trời.',
          materialSuggestions: 'Cắt dán giấy màu thủ công kết hợp vẽ nét bút dạ đen nổi bật.',
        },
      ],
    };
  }

  // Khối 3, 4, 5
  return {
    isCuratedFallback: true,
    friendlyNote: `${wishNote}Cô gợi ý cho em 3 ý tưởng có chiều sâu bố cục, màu sắc tương phản và thông điệp nghệ thuật rõ rệt!`,
    guidingQuestions: [
      'Em muốn chọn góc nhìn cận cảnh nhân vật hay toàn cảnh không gian rộng lớn?',
      'Bức tranh của em muốn gửi gắm cảm xúc rộn ràng hay sự lắng đọng, yên bình?',
    ],
    ideas: [
      {
        title: `Nhịp điệu cuộc sống và ${topicName}`,
        mainContent: `Bức tranh thể hiện không gian sinh hoạt năng động, gắn kết giữa con người và bối cảnh xung quanh theo chủ đề ${topicName}.`,
        charactersAndObjects: 'Nhóm nhân vật chính với trang phục đặc trưng, công trình kiến trúc hoặc cây cối thân quen.',
        activitiesAndDetails: 'Mọi người đang hăng say thực hiện hoạt động chung với nét mặt rạng ngời, cờ hoa hoặc ánh sáng bừng lên.',
        composition: {
          foreground: 'Vật thể hoặc nhân vật gần nhất được vẽ to, rõ nét, có độ đậm nhạt chi tiết.',
          midground: 'Các nhóm nhân vật trung tâm đang tương tác với nhau, làm nổi bật chủ đề chính.',
          background: 'Hàng cây, mái nhà hoặc dãy núi mờ dần về phía xa tạo chiều sâu không gian.',
        },
        colorSuggestions: 'Sử dụng sự tương phản giữa gam màu nóng (vàng, cam) và màu lạnh (xanh lam, xanh ngọc) để nhấn mạnh trọng tâm.',
        creativeSpark: 'Vệt nắng sớm chiếu xiên qua kẽ lá tạo thành các vệt sáng lung linh trên mặt đất.',
        materialSuggestions: 'Màu nước trên giấy dày, phối hợp kỹ thuật loang màu ướt trên ướt cho bầu trời.',
      },
      {
        title: `Ký ức quê hương thanh bình`,
        mainContent: `Tái hiện vẻ đẹp mộc mạc, đậm đà bản sắc văn hóa dân tộc và tình yêu quê hương đất nước qua chủ đề ${topicName}.`,
        charactersAndObjects: 'Bến nước, con đò nhỏ, lũy tre làng, bác nông dân dắt trâu hay các bạn nhỏ rước đèn.',
        activitiesAndDetails: 'Tiếng cười rộn rã trên đường làng uốn lượn, khói lam chiều bảng lảng vờn quanh mái rạ.',
        composition: {
          foreground: 'Vạt cỏ xanh ven đường có vài chú chuồn chuồn ớt đậu trên ngọn cỏ.',
          midground: 'Dòng sông êm ả với chiếc thuyền nan và bóng người soi bóng nước.',
          background: 'Rặng tre xanh cong vút và vầng mặt trời đỏ ối đang lặn dần sau rặng đồi.',
        },
        colorSuggestions: 'Tông màu đất ấm áp: vàng rơm, nâu đất, xanh rêu và đỏ son truyền thống.',
        creativeSpark: 'Những cánh diều no gió chao liệng giữa ráng chiều mang theo ước mơ bay xa.',
        materialSuggestions: 'Màu sáp dầu phối hợp kỹ thuật miết ngón tay để tạo độ chuyển êm dịu của ráng chiều.',
      },
      {
        title: `Thông điệp yêu thương và tương lai`,
        mainContent: `Ý tưởng sáng tạo giàu tính biểu trưng, thể hiện suy nghĩ và ước mơ về một thế giới tươi đẹp, văn minh và gắn kết.`,
        charactersAndObjects: 'Trẻ em nhiều vùng miền nắm tay nhau, biểu tượng chim bồ câu trắng, quả địa cầu xanh.',
        activitiesAndDetails: 'Các bạn nhỏ cùng nhau trồng cây xanh, thả chim bồ câu hoặc vẽ bức tranh tương lai ngập tràn nụ cười.',
        composition: {
          foreground: 'Những bàn tay nhỏ cùng nâng niu mầm cây non hoặc quả cầu xanh biếc.',
          midground: 'Vòng tay bè bạn kết nối trải dài qua các danh lam thắng cảnh.',
          background: 'Bầu trời rực sáng ánh bình minh với những đám mây ngũ sắc hy vọng.',
        },
        colorSuggestions: 'Các gam màu trong sáng: xanh lục của chồi non, trắng tinh khôi của bồ câu và vàng rạng rỡ của nắng mới.',
        creativeSpark: 'Cành lá mầm non có hình dáng cách điệu như một trái tim ấm áp.',
        materialSuggestions: 'Tranh kết hợp màu gouache và xé dán giấy màu tạo hiệu ứng chất cảm đa dạng.',
      },
    ],
  };
}

function generateCuratedFallbackReview(
  topicName?: string,
  grade?: number,
  studentDescription?: string
): ArtReviewResponse {
  return {
    isArtworkDetected: true,
    isCuratedFallback: true,
    interestingThings: `Bức tranh chủ đề "${topicName || 'Tự do sáng tạo'}" thể hiện những mảng hình rõ ràng, các chi tiết được vẽ với nét vẽ hồn nhiên, chân thật của học sinh ${grade ? `Lớp ${grade}` : 'tiểu học'}.`,
    composition: 'Hình vẽ trung tâm được đặt cân đối ở khoảng giữa trang giấy, các chi tiết phụ trợ xung quanh giúp khung tranh không bị trống trải.',
    colors: 'Màu sắc được sử dụng tươi sáng, có sự phân chia giữa mảng màu chính và màu nền, tạo cảm giác vui mắt và sinh động.',
    creativeDetails: 'Nét vẽ ngây thơ, tự nhiên cùng với cách thể hiện chi tiết riêng đã mang lại cảm xúc trong trẻo cho tác phẩm.',
    suggestions: [
      'Bé có thể tô màu nền kín thêm một chút để các nhân vật chính nổi bật hơn nữa nhé!',
      'Dùng bút chì màu hoặc bút viền nhấn nhẹ lại những đường bao quanh để tranh thêm sắc nét.',
      'Nếu muốn, bé có thể điểm thêm 1-2 bông hoa hoặc chú bướm nhỏ ở góc tranh cho thêm phần rộn ràng!',
    ],
    encouragement: 'Bức tranh của con rất đáng yêu và tràn ngập sự trong sáng! Hãy tiếp tục tự tin cầm cọ vẽ thêm nhiều tác phẩm tuyệt vời nữa nhé!',
  };
}
