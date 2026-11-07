/**
 * Danh mục Chủ đề Mĩ thuật Tiểu học (Khối 1 đến Khối 5)
 * Tuân thủ chính xác 100% danh mục chương trình giáo dục Mĩ thuật tiểu học.
 */

export interface TopicItem {
  id: string;
  grade: number;
  order: number;
  name: string;
  description: string;
  samplePrompts: string[];
  suggestedMaterials: string[];
}

export const CURRICULUM_TOPICS: Record<number, TopicItem[]> = {
  1: [
    {
      id: "k1-1",
      grade: 1,
      order: 1,
      name: "Sáng tạo từ những chấm màu",
      description: "Sử dụng các chấm tròn to, nhỏ, nhiều màu sắc để tạo nên hoa, bướm, mưa rơi, vảy cá hoặc bầu trời sao lấp lánh.",
      samplePrompts: [
        "Em muốn chấm màu làm bông hoa cầu vồng nở rộ",
        "Em muốn dùng những chấm màu vẽ chú bướm rực rỡ",
        "Em muốn vẽ cơn mưa bóng bay từ nhiều chấm tròn to nhỏ"
      ],
      suggestedMaterials: ["Sáp màu", "Màu nước chấm tay / tăm bông", "Bút dạ màu", "Giấy vẽ"]
    },
    {
      id: "k1-2",
      grade: 1,
      order: 2,
      name: "Nét vẽ của em",
      description: "Khám phá nét thẳng, nét cong, nét lượn sóng, nét đứt để vẽ những con đường, ngọn sóng, mái nhà hay chiếc thuyền.",
      samplePrompts: [
        "Em muốn vẽ những ngọn sóng biển dập dềnh bằng nét lượn sóng",
        "Em muốn vẽ cầu vồng nhiều tầng bằng nét cong",
        "Em muốn vẽ ngôi nhà và hàng rào bằng nét thẳng và nét xiên"
      ],
      suggestedMaterials: ["Bút sáp dầu", "Bút chì màu", "Giấy trắng A4"]
    },
    {
      id: "k1-3",
      grade: 1,
      order: 3,
      name: "Sáng tạo từ những khối cơ bản",
      description: "Nhận biết khối lập phương, khối trụ, khối cầu và tưởng tượng thành hộp quà, người tuyết, ngôi nhà đồ chơi.",
      samplePrompts: [
        "Em muốn vẽ chú người tuyết từ hai khối cầu trắng muốt",
        "Em muốn vẽ đoàn tàu hoả từ khối trụ và khối hộp",
        "Em muốn vẽ hộp quà sinh nhật bất ngờ"
      ],
      suggestedMaterials: ["Đất nặn", "Sáp màu", "Vỏ hộp giấy tái chế", "Giấy màu"]
    },
    {
      id: "k1-4",
      grade: 1,
      order: 4,
      name: "Màu cơ bản trong Mĩ thuật",
      description: "Khám phá ba màu gốc diệu kỳ: Đỏ, Vàng, Lam và cảm giác vui tươi khi các màu đứng cạnh nhau.",
      samplePrompts: [
        "Em muốn vẽ đèn giao thông với 3 màu rực rỡ",
        "Em muốn vẽ chú chim ngộ nghĩnh có cánh màu lam, đuôi màu đỏ, mỏ vàng",
        "Em muốn vẽ cánh đồng hoa chỉ dùng màu đỏ, vàng và lam"
      ],
      suggestedMaterials: ["Màu sáp", "Màu nước", "Giấy màu thủ công"]
    },
    {
      id: "k1-5",
      grade: 1,
      order: 5,
      name: "Sáng tạo từ những hình cơ bản",
      description: "Ghép hình tròn, hình vuông, hình tam giác, chữ nhật thành con cá, ngôi nhà, chiếc ô tô hay ông mặt trời.",
      samplePrompts: [
        "Em muốn ghép hình tam giác và hình vuông thành ngôi làng xinh xắn",
        "Em muốn vẽ chú cá bơi lội từ hình tam giác và hình tròn",
        "Em muốn tạo chú robot thân thiện từ các khối hình vuông và chữ nhật"
      ],
      suggestedMaterials: ["Giấy màu thủ công cắt dán", "Bút sáp màu", "Hồ dán"]
    },
    {
      id: "k1-6",
      grade: 1,
      order: 6,
      name: "Hoa quả",
      description: "Vẽ những quả quen thuộc như quả cam tròn xoe, quả chuối cong cong, quả dưa hấu mát lành.",
      samplePrompts: [
        "Em muốn vẽ đĩa dưa hấu đỏ tươi lấm tấm hạt đen",
        "Em muốn vẽ rổ trái cây gia đình ngày Tết",
        "Em muốn vẽ quả táo đỏ tươi cười thật vui vẻ"
      ],
      suggestedMaterials: ["Sáp màu", "Bút chì màu", "Giấy vẽ"]
    },
    {
      id: "k1-7",
      grade: 1,
      order: 7,
      name: "Người thân của em",
      description: "Vẽ chân dung hoặc khoảnh khắc ấm áp bên ông bà, bố mẹ, anh chị em trong gia đình.",
      samplePrompts: [
        "Em muốn vẽ mẹ đang ôm em cười thật tươi",
        "Em muốn vẽ bố dắt tay em đi dạo công viên",
        "Em muốn vẽ nụ cười hiền từ của bà nội"
      ],
      suggestedMaterials: ["Bút sáp màu", "Màu chì", "Giấy vẽ trắng"]
    },
    {
      id: "k1-8",
      grade: 1,
      order: 8,
      name: "Em là học sinh lớp 1",
      description: "Kỷ niệm ngày đầu vào lớp 1, mang cặp sách mới, làm quen thầy cô và bạn bè mới.",
      samplePrompts: [
        "Em muốn vẽ em tung tăng đeo cặp mới đến cổng trường",
        "Em muốn vẽ lớp học ấm áp của em cùng các bạn ngồi ngoan",
        "Em muốn vẽ giờ ra chơi em cùng bạn chơi nhảy dây ở sân trường"
      ],
      suggestedMaterials: ["Sáp màu", "Bút dạ kim", "Giấy vẽ A4"]
    }
  ],

  2: [
    {
      id: "k2-1",
      grade: 2,
      order: 1,
      name: "Sự thú vị của nét",
      description: "Kết hợp đa dạng các nét: nét xoắn ốc, nét ziczac, nét cong mềm mại để tạo hoa văn và biểu cảm cho sự vật.",
      samplePrompts: [
        "Em muốn vẽ vỏ ốc biển thần kỳ với nét xoắn ốc lấp lánh",
        "Em muốn vẽ ngọn lửa bập bùng bằng nét ziczac sống động",
        "Em muốn vẽ mái tóc bồng bềnh của bạn gái bằng nét lượn sóng"
      ],
      suggestedMaterials: ["Bút dạ đen viền nét", "Sáp dầu", "Màu chì"]
    },
    {
      id: "k2-2",
      grade: 2,
      order: 2,
      name: "Sự kết hợp của các hình cơ bản",
      description: "Biến hóa và lồng ghép các hình cơ bản để vẽ phương tiện giao thông, công viên giải trí hay lâu đài cổ tích.",
      samplePrompts: [
        "Em muốn vẽ lâu đài cổ tích lộng lẫy từ tháp tam giác và tường chữ nhật",
        "Em muốn vẽ chiếc khinh khí cầu khổng lồ bay trên bầu trời",
        "Em muốn vẽ công viên thiếu nhi với vòng quay đu quay tròn xoe"
      ],
      suggestedMaterials: ["Cắt dán giấy thủ công", "Sáp màu", "Bút chì"]
    },
    {
      id: "k2-3",
      grade: 2,
      order: 3,
      name: "Những mảng màu yêu thích",
      description: "Thực hành tô màu theo từng mảng lớn, mảng nhỏ, tìm hiểu cách mảng màu nóng và mảng màu lạnh tạo cảm xúc.",
      samplePrompts: [
        "Em muốn vẽ bầu trời hoàng hôn rực rỡ với các mảng cam vàng tím",
        "Em muốn vẽ khu vườn hoa rực rỡ sắc màu",
        "Em muốn vẽ chú cá mảng màu trừu tượng bơi dưới đáy đại dương"
      ],
      suggestedMaterials: ["Màu sáp dầu", "Màu nước hoặc gouache", "Giấy dày"]
    },
    {
      id: "k2-4",
      grade: 2,
      order: 4,
      name: "Sự kết hợp thú vị của khối",
      description: "Tạo hình không gian 3 chiều qua sự liên kết các khối hình: ngôi nhà cao tầng, robot thông minh, đồ chơi.",
      samplePrompts: [
        "Em muốn vẽ dãy phố nhà cao tầng với những ô cửa sổ sáng đèn",
        "Em muốn nặn chú cún con từ khối trụ và khối cầu",
        "Em muốn tạo mô hình phi thuyền không gian từ các khối hình hộp"
      ],
      suggestedMaterials: ["Đất nặn", "Vỏ hộp thuốc/bánh kẹo tái chế", "Băng dính", "Sáp màu"]
    },
    {
      id: "k2-5",
      grade: 2,
      order: 5,
      name: "Sắc màu thiên nhiên",
      description: "Cảm nhận và vẽ vẻ đẹp của cây cối, dòng sông, mây trời và bốn mùa xuân, hạ, thu, đông.",
      samplePrompts: [
        "Em muốn vẽ khu rừng mùa thu thay lá vàng rực",
        "Em muốn vẽ cánh đồng lúa chín vàng óng ánh dưới nắng hè",
        "Em muốn vẽ bờ suối róc rách trong vắt giữa đồi hoa cỏ non"
      ],
      suggestedMaterials: ["Màu sáp", "Màu nước", "Bút chì", "Giấy vẽ"]
    },
    {
      id: "k2-6",
      grade: 2,
      order: 6,
      name: "Gương mặt thân quen",
      description: "Quan sát và vẽ đặc điểm khuôn mặt của bạn bè, cô giáo hay người thân với các biểu cảm vui, ngạc nhiên, hân hoan.",
      samplePrompts: [
        "Em muốn vẽ khuôn mặt tươi cười của bạn thân ngồi cùng bàn",
        "Em muốn vẽ cô giáo dịu hiền đeo kính đang giảng bài",
        "Em muốn vẽ chân dung ngộ nghĩnh của em khi ăn kem"
      ],
      suggestedMaterials: ["Bút chì màu", "Sáp dầu", "Giấy vẽ khổ A4"]
    },
    {
      id: "k2-7",
      grade: 2,
      order: 7,
      name: "Bữa cơm gia đình",
      description: "Khung cảnh sum vầy ấm cúng quanh mâm cơm, bát đũa, món ăn mẹ nấu và tiếng cười rộn rã.",
      samplePrompts: [
        "Em muốn vẽ cả nhà quây quần bên mâm cơm tối ấm áp ánh đèn",
        "Em muốn vẽ cảnh em đang giúp mẹ dọn bát đũa ra bàn",
        "Em muốn vẽ bữa cơm tất niên rộn ràng ngày Tết"
      ],
      suggestedMaterials: ["Sáp màu", "Màu dạ", "Giấy vẽ"]
    },
    {
      id: "k2-8",
      grade: 2,
      order: 8,
      name: "Thầy cô của em",
      description: "Bày tỏ tình cảm yêu mến, kính trọng thầy cô qua những khoảnh khắc trên bục giảng, chăm sóc học sinh.",
      samplePrompts: [
        "Em muốn vẽ cô giáo đang hướng dẫn em nắn nót từng chữ",
        "Em muốn vẽ thầy giáo thể dục cùng chúng em tập thể dục giữa giờ",
        "Em muốn vẽ khoảnh khắc chúng em tặng hoa thầy cô ngày 20-11"
      ],
      suggestedMaterials: ["Sáp màu", "Màu nước", "Bút chì"]
    },
    {
      id: "k2-9",
      grade: 2,
      order: 9,
      name: "Đồ chơi từ tạo hình con vật",
      description: "Sáng tạo những món đồ chơi đáng yêu lấy cảm hứng từ chú mèo, chú thỏ, chú gà con bằng hình vẽ hoặc nặn.",
      samplePrompts: [
        "Em muốn làm chú thỏ bông ngộ nghĩnh có đôi tai dài",
        "Em muốn vẽ chú rùa nhỏ mang mai đầy hoa văn làm đồ chơi đẩy xe",
        "Em muốn tạo hình chú ếch xanh bằng đất nặn biết há miệng"
      ],
      suggestedMaterials: ["Đất nặn nhiều màu", "Cốc giấy/đĩa giấy", "Màu sáp", "Keo dán"]
    }
  ],

  3: [
    {
      id: "k3-1",
      grade: 3,
      order: 1,
      name: "Hoa văn trên trang phục của một số dân tộc",
      description: "Tìm hiểu vẻ đẹp hoa văn hình học, hoa lá, muông thú trên thổ cẩm của đồng bào dân tộc Mông, Thái, Chăm, Dao...",
      samplePrompts: [
        "Em muốn vẽ chiếc váy xòe hoa văn dệt thổ cẩm của bạn nhỏ vùng cao",
        "Em muốn vẽ chiếc khăn piêu duyên dáng với họa tiết hình thoi",
        "Em muốn sáng tạo hoa văn thổ cẩm cách điệu hình mặt trời và cánh chim"
      ],
      suggestedMaterials: ["Bút dạ kim", "Màu sáp dầu", "Màu nước", "Thước kẻ"]
    },
    {
      id: "k3-2",
      grade: 3,
      order: 2,
      name: "Màu sắc em yêu",
      description: "Phối hợp màu tương phản, màu bổ túc hoặc gam màu nóng - lạnh để bộc lộ cảm xúc yêu đời, sôi nổi hay êm dịu.",
      samplePrompts: [
        "Em muốn vẽ bức tranh phố đêm lung linh với sự tương phản giữa đèn vàng và nền đêm xanh lam",
        "Em muốn vẽ vườn hoa xuân rực rỡ với các gam màu tươi sáng",
        "Em muốn vẽ thế giới thủy cung huyền bí ngập tràn sắc xanh ngọc"
      ],
      suggestedMaterials: ["Màu sáp dầu", "Màu nước", "Bút cọ bản mềm", "Giấy canson"]
    },
    {
      id: "k3-3",
      grade: 3,
      order: 3,
      name: "Vẻ đẹp của khối",
      description: "Thể hiện độ đậm nhạt và không gian ánh sáng trên các khối trụ, khối chóp, khối cầu trong đời sống và kiến trúc.",
      samplePrompts: [
        "Em muốn vẽ cụm tượng đài hoặc ngọn hải đăng sừng sững",
        "Em muốn vẽ tĩnh vật lọ hoa hình trụ và quả táo hình cầu có bóng đổ",
        "Em muốn vẽ công trình kiến trúc hiện đại với các khối nhà ziczac"
      ],
      suggestedMaterials: ["Chì than / chì mềm 2B-4B", "Sáp màu", "Giấy vẽ mỹ thuật"]
    },
    {
      id: "k3-4",
      grade: 3,
      order: 4,
      name: "Biết ơn thầy cô",
      description: "Gửi gắm lòng tri ân sâu sắc đến thầy cô qua bức tranh giờ học bổ ích, tấm thiệp chúc mừng tự làm hay ngày hội trường.",
      samplePrompts: [
        "Em muốn vẽ bức thiệp 20-11 trang trí hoa hướng dương tặng cô giáo",
        "Em muốn vẽ cảnh cô giáo ân cần che ô cho học sinh dưới cơn mưa",
        "Em muốn vẽ toàn trường rực rỡ cờ hoa trong lễ kỷ niệm ngày Nhà giáo"
      ],
      suggestedMaterials: ["Giấy bìa màu", "Màu sáp", "Ruy băng / cúc áo", "Màu nước"]
    },
    {
      id: "k3-5",
      grade: 3,
      order: 5,
      name: "Một số vật liệu sử dụng trong thực hành, sáng tạo mĩ thuật",
      description: "Khám phá sự phối hợp sáng tạo giữa lá cây khô, hạt đậu, vỏ sò, len sợi, giấy báo cũ để tạo nên tác phẩm collage độc đáo.",
      samplePrompts: [
        "Em muốn làm bức tranh con công xòe đuôi từ lá cây khô nhặt ở sân trường",
        "Em muốn đính các hạt gạo và đậu đen tạo hình bức tranh làng quê",
        "Em muốn làm chú cừu bông trắng từ len vụn và cúc áo"
      ],
      suggestedMaterials: ["Lá cây khô ép phẳng", "Hạt ngũ cốc", "Len sợi thừa", "Keo sữa", "Bìa carton"]
    },
    {
      id: "k3-6",
      grade: 3,
      order: 6,
      name: "Cảnh vật quanh em",
      description: "Quan sát và tái hiện con đường đi học, ngõ nhỏ quen thuộc, góc chợ quê hay bờ ao rợp bóng tre.",
      samplePrompts: [
        "Em muốn vẽ con đường làng uốn lượn có đàn trâu gặm cỏ lúc chiều tà",
        "Em muốn vẽ góc phố nhỏ buổi sáng với quán bánh mì quen thuộc",
        "Em muốn vẽ công viên gần nhà có hồ nước và hàng cây rủ bóng"
      ],
      suggestedMaterials: ["Màu sáp dầu", "Màu nước", "Bút chì phác thảo"]
    },
    {
      id: "k3-7",
      grade: 3,
      order: 7,
      name: "Người thân trong gia đình",
      description: "Khắc họa tình cảm ruột thịt qua nét vẽ chi tiết về dáng vẻ, ánh mắt, nụ cười của từng thành viên trong nhà.",
      samplePrompts: [
        "Em muốn vẽ bố đang sửa chiếc xe đạp nhỏ cho em",
        "Em muốn vẽ ông nội đang tưới những chậu phong lan trên sân thượng",
        "Em muốn vẽ mẹ và em cùng nhau làm bánh trong gian bếp ấm cúng"
      ],
      suggestedMaterials: ["Màu sáp", "Màu chì", "Bút viền nét"]
    },
    {
      id: "k3-8",
      grade: 3,
      order: 8,
      name: "Sinh hoạt gia đình",
      description: "Những hoạt động chung đầy ắp kỷ niệm: cùng dọn dẹp nhà cửa đón Tết, gói bánh chưng, cùng xem tivi buổi tối.",
      samplePrompts: [
        "Em muốn vẽ cả nhà cùng gói bánh chưng bên bếp lửa bập bùng",
        "Em muốn vẽ buổi sáng chủ nhật cả nhà cùng nhau dọn dẹp vườn cây",
        "Em muốn vẽ chuyến đi dã ngoại cắm trại của gia đình em bên bờ hồ"
      ],
      suggestedMaterials: ["Sáp màu", "Màu gouache / acrylic", "Giấy A3"]
    }
  ],

  4: [
    {
      id: "k4-1",
      grade: 4,
      order: 1,
      name: "Vẻ đẹp trong điêu khắc đình làng Việt Nam",
      description: "Tìm hiểu di sản chạm khắc gỗ dân gian: hình rồng múa, tiên cưỡi rồng, cảnh chèo thuyền, đánh vật với nét đục mộc mạc, dí dỏm.",
      samplePrompts: [
        "Em muốn vẽ phù điêu rồng ngậm ngọc chạm khắc trên cột đình làng",
        "Em muốn vẽ cảnh đấu vật dân gian theo phong cách chạm khắc đình làng xưa",
        "Em muốn vẽ họa tiết hoa sen và mây cuộn trên vì kèo gỗ cổ"
      ],
      suggestedMaterials: ["Đất sét / đất nặn mô phỏng gỗ", "Bút chì than", "Màu nước tông màu đất nâu đỏ"]
    },
    {
      id: "k4-2",
      grade: 4,
      order: 2,
      name: "Một số dạng không gian trong tranh dân gian Việt Nam",
      description: "Khám phá cách sắp xếp không gian ước lệ trong tranh Đông Hồ, Hàng Trống: không gian phẳng, nhìn từ trên cao xuống, không gian đồng hiện.",
      samplePrompts: [
        "Em muốn vẽ tranh đàn gà mẹ con theo phong cách mộc bản Đông Hồ",
        "Em muốn vẽ đám cưới chuột với bố cục hàng rước rộn ràng trải dài",
        "Em muốn vẽ chú bé cưỡi trâu thả diều với không gian mộc mạc đồng dao"
      ],
      suggestedMaterials: ["Giấy điệp / giấy xi măng thô", "Màu nước hoặc màu sáp", "Bút lông viền đen đậm nét"]
    },
    {
      id: "k4-3",
      grade: 4,
      order: 3,
      name: "Cảnh đẹp quê hương",
      description: "Thể hiện chiều sâu không gian (tiền cảnh, trung cảnh, hậu cảnh) với danh lam thắng cảnh đất nước từ miền núi đến biển đảo.",
      samplePrompts: [
        "Em muốn vẽ ruộng bậc thang Mù Cang Chải uốn lượn vàng óng ả",
        "Em muốn vẽ Vịnh Hạ Long với những hòn đảo đá nhấp nhô trên biển xanh",
        "Em muốn vẽ phố cổ Hội An rực rỡ ánh đèn lồng bên sông Hoài"
      ],
      suggestedMaterials: ["Màu nước", "Màu acrylic trên toan/giấy dày", "Sáp dầu phối màu"]
    },
    {
      id: "k4-4",
      grade: 4,
      order: 4,
      name: "Vẻ đẹp trong cuộc sống",
      description: "Tìm thấy cái đẹp từ những điều giản dị: nụ cười của bác lao công, dòng người tấp nập sớm mai, giọt mồ hôi người lao động.",
      samplePrompts: [
        "Em muốn vẽ cô nhân viên y tế đang tận tình khám chữa bệnh",
        "Em muốn vẽ các cô chú công nhân vệ sinh quét rác dưới ánh đèn đêm",
        "Em muốn vẽ chú cảnh sát giao thông dắt cụ già qua đường an toàn"
      ],
      suggestedMaterials: ["Màu sáp dầu", "Màu nước", "Bút chì phác thảo bố cục"]
    },
    {
      id: "k4-5",
      grade: 4,
      order: 5,
      name: "Những kỉ niệm đẹp",
      description: "Tái hiện một kỷ niệm khó quên trong tuổi thơ: một chuyến đi chơi xa, đêm hội trăng rằm rước đèn, hay buổi biểu diễn văn nghệ trường.",
      samplePrompts: [
        "Em muốn vẽ đêm hội trăng rằm em và bạn rước đèn ông sao tưng bừng",
        "Em muốn vẽ buổi biểu diễn văn nghệ chào mừng ngày khai trường",
        "Em muốn vẽ ngày em được kết nạp Đội Thiếu niên Tiền phong"
      ],
      suggestedMaterials: ["Màu sáp kết hợp màu nước", "Bút dạ", "Giấy vẽ A3"]
    },
    {
      id: "k4-6",
      grade: 4,
      order: 6,
      name: "Mái trường yêu dấu",
      description: "Góc sân trường rợp bóng bàng, hàng ghế đá quen thuộc, lớp học thân thương và hoạt động học tập, vui chơi rộn rã.",
      samplePrompts: [
        "Em muốn vẽ giờ giải lao dưới tán cây bàng đỏ mùa rụng lá",
        "Em muốn vẽ cổng trường thân yêu rực rỡ cờ hoa ngày lễ hội",
        "Em muốn vẽ giờ học thực hành Mĩ thuật ngoài trời của lớp em"
      ],
      suggestedMaterials: ["Sáp dầu", "Màu nước", "Thước kẻ tạo phối cảnh"]
    },
    {
      id: "k4-7",
      grade: 4,
      order: 7,
      name: "Quê hương thanh bình",
      description: "Gợi tả nét yên bình, mộc mạc của làng quê: khói lam chiều, dòng sông êm ả, con đò nhỏ, lũy tre xanh.",
      samplePrompts: [
        "Em muốn vẽ hoàng hôn buông xuống trên bến sông quê có con đò neo đậu",
        "Em muốn vẽ cánh đồng lúa bát ngát cò bay lả dập dờn",
        "Em muốn vẽ buổi trưa hè thanh bình rợp bóng tre ríu rít tiếng chim"
      ],
      suggestedMaterials: ["Màu nước êm dịu", "Màu sáp dầu", "Bút chì 2B"]
    }
  ],

  5: [
    {
      id: "k5-1",
      grade: 5,
      order: 1,
      name: "Yếu tố tạo hình trong thực hành, sáng tạo theo chủ đề",
      description: "Vận dụng tổng hợp điểm, nét, hình, khối, màu sắc, đậm nhạt và chất cảm để tạo nên một tác phẩm hoàn chỉnh có nhịp điệu và trọng tâm.",
      samplePrompts: [
        "Em muốn sáng tạo bức tranh nhịp điệu của âm nhạc bằng các đường nét chuyển động và mảng màu biến ảo",
        "Em muốn tạo hình tác phẩm nghệ thuật hiện đại kết hợp nhiều mảng chất cảm khác nhau",
        "Em muốn vẽ bức tranh thành phố tương lai ứng dụng tương phản màu sắc và đường nét mạnh mẽ"
      ],
      suggestedMaterials: ["Màu acrylic", "Collage xé dán báo và giấy màu", "Bút dạ kim kỹ thuật"]
    },
    {
      id: "k5-2",
      grade: 5,
      order: 2,
      name: "Hình tượng anh hùng dân tộc trong mĩ thuật tạo hình Việt Nam",
      description: "Tái hiện khí phách hào hùng của các vị anh hùng lịch sử (Hai Bà Trưng, Ngô Quyền, Trần Hưng Đạo, Bác Hồ, anh Kim Đồng, chị Võ Thị Sáu...).",
      samplePrompts: [
        "Em muốn vẽ chiến thắng trên sông Bạch Đằng lịch sử với cọc gỗ và thuyền giặc",
        "Em muốn vẽ tượng đài Hai Bà Trưng cưỡi voi xung trận uy nghiêm hào sảng",
        "Em muốn vẽ hình tượng anh Kim Đồng dũng cảm giao liên giữa núi rừng Việt Bắc"
      ],
      suggestedMaterials: ["Màu bột / màu acrylic", "Màu nước trên giấy canson dày", "Chì than"]
    },
    {
      id: "k5-3",
      grade: 5,
      order: 3,
      name: "Gia đình",
      description: "Thể hiện chiều sâu tình cảm, sự gắn kết yêu thương, chia sẻ giữa các thế hệ ông bà, cha mẹ và con cháu qua những chi tiết lắng đọng.",
      samplePrompts: [
        "Em muốn vẽ khoảnh khắc mẹ nhẹ nhàng quạt ru em bé ngủ trưa",
        "Em muốn vẽ ông nội nắm chặt bàn tay nhỏ nhắn của em kể chuyện xưa",
        "Em muốn vẽ chân dung gia đình ba thế hệ quây quần mừng thọ ông bà"
      ],
      suggestedMaterials: ["Màu sáp dầu phối kỹ thuật miết", "Màu nước", "Màu chì cao cấp"]
    },
    {
      id: "k5-4",
      grade: 5,
      order: 4,
      name: "Những hoạt động yêu thích ở trường em",
      description: "Tái hiện sinh động các hoạt động phong phú: ngày hội đọc sách, thi đấu bóng đá, hội trại Cháu ngoan Bác Hồ, chăm sóc vườn hoa trường.",
      samplePrompts: [
        "Em muốn vẽ trận chung kết bóng đá sôi nổi của trường em trong tiếng reo hò",
        "Em muốn vẽ ngày hội đọc sách xanh dưới gốc đa trường",
        "Em muốn vẽ đội viên dọn vệ sinh đài tưởng niệm các anh hùng liệt sĩ"
      ],
      suggestedMaterials: ["Màu nước rực rỡ", "Sáp dầu", "Bút vẽ nét đen"]
    },
    {
      id: "k5-5",
      grade: 5,
      order: 5,
      name: "Những việc làm bình dị mà cao quý trong cuộc sống",
      description: "Tôn vinh những nghĩa cử đẹp: hiến máu cứu người, quyên góp áo ấm cho bạn nghèo vùng cao, giải cứu động vật, trồng cây xanh bảo vệ môi trường.",
      samplePrompts: [
        "Em muốn vẽ các bạn nhỏ xếp sách vở đồ ấm gửi tặng các bạn học sinh vùng lũ",
        "Em muốn vẽ bác bảo vệ trường ân cần che ô đón các bạn nhỏ vào lớp",
        "Em muốn vẽ ngày hội Chủ nhật Xanh cả khu phố cùng nhau trồng cây nhặt rác"
      ],
      suggestedMaterials: ["Màu acrylic", "Sáp dầu", "Bút chì phác thảo biểu cảm nhân vật"]
    },
    {
      id: "k5-6",
      grade: 5,
      order: 6,
      name: "Cảnh sắc quê hương",
      description: "Bức tranh toàn cảnh giàu cảm xúc về vẻ đẹp hùng vĩ hoặc thơ mộng của thiên nhiên non sông đất nước Việt Nam.",
      samplePrompts: [
        "Em muốn vẽ bình minh rực hồng trên đảo Trường Sa thân yêu",
        "Em muốn vẽ ngọn đồi chè xanh ngút ngàn ở cao nguyên Mộc Châu",
        "Em muốn vẽ dòng sông Hương êm đềm với tà áo dài tím và cầu Trường Tiền"
      ],
      suggestedMaterials: ["Màu nước chuyên nghiệp", "Sơn dầu / Acrylic", "Bút lông các cỡ"]
    },
    {
      id: "k5-7",
      grade: 5,
      order: 7,
      name: "Việt Nam đất nước, con người",
      description: "Khắc họa vẻ đẹp tâm hồn người Việt Nam cần cù, hiếu khách, kiên cường; tà áo dài truyền thống, nón lá, lễ hội văn hóa đậm đà bản sắc.",
      samplePrompts: [
        "Em muốn vẽ lễ hội đua thuyền rồng tưng bừng trên sông nước miền Tây",
        "Em muốn vẽ cô thiếu nữ trong tà áo dài trắng thướt tha bên hoa sen ngát hương",
        "Em muốn vẽ điệu múa xòe hoa đoàn kết của các dân tộc anh em bên đống lửa"
      ],
      suggestedMaterials: ["Màu gouache / acrylic", "Màu sáp dầu", "Giấy roki / giấy vẽ mỹ thuật"]
    },
    {
      id: "k5-8",
      grade: 5,
      order: 8,
      name: "Vì một thế giới hòa bình",
      description: "Thông điệp hòa bình, tình hữu nghị năm châu, chim bồ câu trắng, vòng tay gắn kết thiếu nhi toàn thế giới và bảo vệ hành tinh xanh.",
      samplePrompts: [
        "Em muốn vẽ thiếu nhi năm châu da trắng, da vàng, da đen cùng nắm tay quanh Trái Đất",
        "Em muốn vẽ đàn chim bồ câu trắng tung cánh mang cành ô liu bay qua bầu trời rực rỡ",
        "Em muốn vẽ bức tranh ước mơ không còn chiến tranh, trẻ em khắp nơi đều được cắp sách đến trường"
      ],
      suggestedMaterials: ["Màu sáp dầu phối hợp màu nước", "Cắt dán giấy biểu trưng hòa bình", "Bút kim viền nét"]
    }
  ]
};

export const ALL_GRADES = [1, 2, 3, 4, 5] as const;
export type GradeNumber = (typeof ALL_GRADES)[number];

export function getTopicsForGrade(grade: number): TopicItem[] {
  return CURRICULUM_TOPICS[grade] || [];
}

export function findTopicByName(grade: number, name: string): TopicItem | undefined {
  return CURRICULUM_TOPICS[grade]?.find((t) => t.name.toLowerCase().trim() === name.toLowerCase().trim());
}
