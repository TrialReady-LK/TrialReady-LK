import type { TheoryQuestion } from '../types/theory'

export const SRI_LANKA_DMT_MASTER_QUESTIONS: TheoryQuestion[] = [
  // =============================================================
  // 1. REGULATORY ROAD SIGNS
  // =============================================================
  {
    id: 'q-reg-01',
    category: 'road_signs_regulatory',
    question_text:
      'What does an octagonal red sign with the word "STOP" mean to a driver in Sri Lanka?',
    image_url: '🛑',
    options: [
      'Slow down and proceed if the road is clear',
      'Come to a complete stop before the stop line and yield right of way to all traffic',
      'Stop only if there is a traffic police officer present',
      'Stop for 5 seconds and then accelerate',
    ],
    correct_option_index: 1,
    explanation:
      'The STOP sign is an absolute mandatory regulatory sign. The driver must come to a complete stop before the line and proceed only when clear.',
    translations: {
      en: {
        question_text:
          'What does an octagonal red sign with the word "STOP" mean to a driver in Sri Lanka?',
        options: [
          'Slow down and proceed if the road is clear',
          'Come to a complete stop before the stop line and yield right of way to all traffic',
          'Stop only if there is a traffic police officer present',
          'Stop for 5 seconds and then accelerate',
        ],
        explanation:
          'The STOP sign is an absolute mandatory regulatory sign. The driver must come to a complete stop before the line and proceed only when clear.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ රියදුරෙකුට "STOP" (නවත්වන්න) යනුවෙන් සඳහන් අෂ්ටාස්‍රාකාර රතු සංඥාවෙන් අදහස් වන්නේ කුමක්ද?',
        options: [
          'වේගය අඩු කර මාර්ගය පැහැදිලි නම් ඉදිරියට ධාවනය කිරීම',
          'නැවතුම් රේඛාවට පෙර වාහනය සම්පූර්ණයෙන්ම නවතා ප්‍රමුඛතාව ලබා දීම',
          'රථවාහන පොලිස් නිලධාරියෙකු සිටී නම් පමණක් නැවැත්වීම',
          'තත්පර 5ක් නවතා නැවත වේගයෙන් ධාවනය කිරීම',
        ],
        explanation:
          'STOP සංඥාව අනිවාර්ය නියාමන සංඥාවකි. රියදුරු නැවතුම් රේඛාවට පෙර වාහනය සම්පූර්ණයෙන්ම නවත්වා මාර්ගය ආරක්ෂිත වූ විට පමණක් ඉදිරියට යා යුතුය.',
      },
      ta: {
        question_text:
          'இலங்கையில் "STOP" (நிறுத்துக) என எழுதப்பட்ட எண்கோண சிவப்பு சைகை சாரதிக்கு எதனைக் குறிக்கிறது?',
        options: [
          'வேகத்தை குறைத்து வீதி தெளிவாக இருந்தால் முன்னோக்கி செல்லவும்',
          'நிறுத்தக் கோட்டுக்கு முன் வாகனத்தை முழுமையாக நிறுத்தி அனைத்து வாகனங்களுக்கும் வழிவிடவும்',
          'போக்குவரத்து பொலிஸ் அதிகாரி இருந்தால் மட்டுமே நிறுத்தவும்',
          '5 வினாடிகள் நிறுத்தி பின்னர் வேகமாக செல்லவும்',
        ],
        explanation:
          'STOP சைகை ஒரு கட்டாய ஒழுங்குமுறை சைகையாகும். சாரதி கோட்டுக்கு முன் முழுமையாக வாகனத்தை நிறுத்தி வீதி பாதுகாப்பான பின்பே முன்னோக்கி செல்ல வேண்டும்.',
      },
    },
  },
  {
    id: 'q-reg-02',
    category: 'road_signs_regulatory',
    question_text:
      'What is the meaning of an inverted triangular sign with a red border reading "GIVE WAY"?',
    image_url: '▽',
    options: [
      'You have the priority over all other vehicles',
      'You must slow down or stop to give way to traffic on the major road',
      'No entry for heavy vehicles',
      'Parking allowed for 15 minutes',
    ],
    correct_option_index: 1,
    explanation:
      'The GIVE WAY sign instructs the driver to yield to vehicles approaching on the main road before joining or crossing.',
    translations: {
      en: {
        question_text:
          'What is the meaning of an inverted triangular sign with a red border reading "GIVE WAY"?',
        options: [
          'You have the priority over all other vehicles',
          'You must slow down or stop to give way to traffic on the major road',
          'No entry for heavy vehicles',
          'Parking allowed for 15 minutes',
        ],
        explanation:
          'The GIVE WAY sign instructs the driver to yield to vehicles approaching on the main road before joining or crossing.',
      },
      si: {
        question_text:
          '"GIVE WAY" (ප්‍රමුඛතාව දෙන්න) යනුවෙන් සඳහන් රතු මායිමක් සහිත උඩුයටිකුරු ත්‍රිකෝණාකාර සංඥාවේ තේරුම කුමක්ද?',
        options: [
          'අනෙක් සියලුම වාහන වලට වඩා ඔබට ප්‍රමුඛතාවය හිමිවේ',
          'ප්‍රධාන මාර්ගයේ ගමන් කරන වාහන වලට ප්‍රමුඛතාවය ලබා දීමට වේගය අඩු කිරීම හෝ නැවැත්වීම',
          'බර වාහන ඇතුළුවීම තහනම්',
          'විනාඩි 15ක් වාහන නැවැත්වීමට අවසර ඇත',
        ],
        explanation:
          'GIVE WAY සංඥාව මගින් ප්‍රධාන මාර්ගයට ඇතුළු වීමට පෙර එහි ගමන් ගන්නා රථවාහන වලට ප්‍රමුඛතාවය ලබා දෙන ලෙස රියදුරුට නියෝග කරයි.',
      },
      ta: {
        question_text:
          '"GIVE WAY" (வழி விடுக) என்று எழுதப்பட்ட சிவப்பு எல்லையுடன் கூடிய தலைகீழ் முக்கோண சைகையின் அர்த்தம் யாது?',
        options: [
          'மற்றைய அனைத்து வாகனங்களுக்கும் முன் உங்களுக்கே முன்னுரிமை உண்டு',
          'பிரதான வீதியில் வரும் வாகனங்களுக்கு வழிவிட வேகத்தை குறைக்கவும் அல்லது நிறுத்தவும்',
          'கனரக வாகனங்கள் நுழைய தடை',
          '15 நிமிடங்களுக்கு வாகனத்தை நிறுத்த அனுமதி',
        ],
        explanation:
          'GIVE WAY சைகை பிரதான வீதியில் நுழையும் போது அங்கு செல்லும் வாகனங்களுக்கு முன்னுரிமை வழங்கி செல்லுமாறு கட்டளையிடுகிறது.',
      },
    },
  },
  {
    id: 'q-reg-03',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a red border containing the number "50" inside indicates:',
    image_url: '⑯ 50',
    options: [
      'Minimum speed limit of 50 km/h',
      'Maximum speed limit of 50 km/h in this road zone',
      'Highway distance to the next town is 50 km',
      'Weight limit of 5.0 tonnes',
    ],
    correct_option_index: 1,
    explanation:
      'Circular signs with red borders indicate prohibitions or maximum restrictions. "50" represents a maximum speed limit of 50 km/h.',
    translations: {
      en: {
        question_text:
          'A circular sign with a red border containing the number "50" inside indicates:',
        options: [
          'Minimum speed limit of 50 km/h',
          'Maximum speed limit of 50 km/h in this road zone',
          'Highway distance to the next town is 50 km',
          'Weight limit of 5.0 tonnes',
        ],
        explanation:
          'Circular signs with red borders indicate prohibitions or maximum restrictions. "50" represents a maximum speed limit of 50 km/h.',
      },
      si: {
        question_text:
          'රතු මායිමක් සහිත වෘත්තාකාර සංඥාවක "50" අංකය ඇතුළත්ව ඇති විට ඉන් අදහස් වන්නේ:',
        options: [
          'අවම වේග සීමාව පැයට කිලෝමීටර් 50 කි',
          'මෙම මාර්ග කලාපයේ උපරිම වේග සීමාව පැයට කිලෝමීටර් 50 කි',
          'ඊළඟ නගරයට ඇති දුර කිලෝමීටර් 50 කි',
          'බර සීමාව ටොන් 5.0 කි',
        ],
        explanation:
          'රතු මායිමක් සහිත වෘත්තාකාර සංඥා මගින් උපරිම සීමා පනවනු ලැබේ. "50" යනු පැයට කි.මී. 50ක උපරිම වේග සීමාවයි.',
      },
      ta: {
        question_text:
          'சிவப்பு எல்லையுடன் கூடிய வட்ட சைகையினுள் "50" என்ற எண் காணப்படுமாயின் அது குறிப்பது:',
        options: [
          'குறைந்தபட்ச வேகம் 50 km/h',
          'இந்த வீதிப் பிரிவில் அதிகபட்ச வேக வரம்பு 50 km/h',
          'அடுத்த நகரத்திற்கான தூரம் 50 km',
          'வாகன எடை வரம்பு 5.0 தொன்',
        ],
        explanation:
          'சிவப்பு எல்லையுடைய வட்ட சைகைகள் அதிகபட்ச கட்டுப்பாடுகளை குறிக்கின்றன. "50" என்பது மணிக்கு 50 கி.மீ அதிகபட்ச வேக வரம்பாகும்.',
      },
    },
  },
  {
    id: 'q-reg-04',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a white horizontal bar on a solid red background means:',
    image_url: '⛔',
    options: [
      'No Entry for all vehicles',
      'One way road ahead',
      'Road works in progress',
      'Dead end street',
    ],
    correct_option_index: 0,
    explanation:
      'The solid red circle with a horizontal white bar is the international and Sri Lankan "No Entry" sign.',
    translations: {
      en: {
        question_text:
          'A circular sign with a white horizontal bar on a solid red background means:',
        options: [
          'No Entry for all vehicles',
          'One way road ahead',
          'Road works in progress',
          'Dead end street',
        ],
        explanation:
          'The solid red circle with a horizontal white bar is the international and Sri Lankan "No Entry" sign.',
      },
      si: {
        question_text:
          'රතු පසුබිමක සුදු පැහැති තිරස් තීරුවක් සහිත වෘත්තාකාර සංඥාවෙන් අදහස් වන්නේ:',
        options: [
          'සියලුම වාහන ඇතුළුවීම තහනම් (No Entry)',
          'ඉදිරියෙන් එක් මංතීරු මාර්ගයකි',
          'මාර්ග සංවර්ධන කටයුතු සිදුවේ',
          'ඉදිරියෙන් මාර්ගය අවසන් වේ',
        ],
        explanation:
          'රතු පසුබිමේ ඇති සුදු තිරස් තීරුව මගින් සියලුම වාහන සඳහා "ඇතුළුවීම තහනම්" බව නියාමනය කරයි.',
      },
      ta: {
        question_text:
          'சிவப்பு பின்னணியில் வெள்ளை கிடைமட்ட கோடு உள்ள வட்ட சைகை குறிப்பது:',
        options: [
          'எந்தவொரு வாகனமும் நுழைய தடை (No Entry)',
          'ஒரு வழிப்பாதை',
          'வீதி புனரமைப்பு வேலைகள் நடைபெறுகின்றன',
          'முட்டுச் சந்து',
        ],
        explanation:
          'சிவப்பு பின்னணியில் வெள்ளை கிடைமட்ட கோடு உள்ள சைகையானது சகல வாகனங்களும் "நுழைய தடை" என்பதைக் குறிக்கிறது.',
      },
    },
  },
  {
    id: 'q-reg-05',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a blue background and a white arrow pointing to the left mandates:',
    image_url: '⬅️',
    options: [
      'Compulsory turn left ahead',
      'No left turn permitted',
      'Left lane closed for repairs',
      'One way road approaching on right',
    ],
    correct_option_index: 0,
    explanation:
      'Blue circular signs with white arrows indicate mandatory positive instructions. A left arrow means all vehicles must turn left.',
    translations: {
      en: {
        question_text:
          'A circular sign with a blue background and a white arrow pointing to the left mandates:',
        options: [
          'Compulsory turn left ahead',
          'No left turn permitted',
          'Left lane closed for repairs',
          'One way road approaching on right',
        ],
        explanation:
          'Blue circular signs with white arrows indicate mandatory positive instructions. A left arrow means all vehicles must turn left.',
      },
      si: {
        question_text:
          'නිල් පැහැති පසුබිමක වමට යොමු වූ සුදු ඊතලයක් සහිත වෘත්තාකාර සංඥාවෙන් නියෝග කරන්නේ:',
        options: [
          'අනිවාර්යයෙන්ම වමට හැරවිය යුතුය (Compulsory turn left)',
          'වමට හැරවීම තහනම්ය',
          'වම් මංතීරුව වසා ඇත',
          'දකුණින් එක් මංතීරු මාර්ගයක් හමුවේ',
        ],
        explanation:
          'නිල් පැහැති වෘත්තාකාර සංඥා අනිවාර්ය නියෝග දක්වයි. වමට යොමු වූ ඊතලය මගින් අනිවාර්යයෙන් වමට හැරවිය යුතු බව දක්වයි.',
      },
      ta: {
        question_text:
          'நீல நிற வட்ட பின்னணியில் இடப்பக்கம் சுட்டும் வெள்ளை அம்பு குறிப்பது:',
        options: [
          'கட்டாயமாக இடப்பக்கம் திரும்ப வேண்டும்',
          'இடப்பக்கம் திரும்புவது தடை செய்யப்பட்டுள்ளது',
          'இடது ஒழுங்கை மூடப்பட்டுள்ளது',
          'வலப்பக்கத்தில் ஒரு வழிப்பாதை உள்ளது',
        ],
        explanation:
          'நீல நிற வட்ட சைகைகள் கட்டாய வழிகாட்டலை குறிக்கின்றன. இடப்பக்க அம்பு சாரதிகள் கட்டாயமாக இடப்பக்கம் திரும்ப வேண்டும் என்பதை உணர்த்துகிறது.',
      },
    },
  },
  {
    id: 'q-reg-06',
    category: 'road_signs_regulatory',
    question_text:
      'A circular sign with a red border containing two cars side by side (one black, one red) signifies:',
    image_url: '🚫 🚗🚗',
    options: [
      'Overtaking prohibited for all motor vehicles',
      'Dual carriageway begins ahead',
      'Car racing allowed on this sector',
      'Vehicles must drive parallel in two lines',
    ],
    correct_option_index: 0,
    explanation:
      'This sign strictly prohibits overtaking. Drivers must not overtake any motorized vehicle on this stretch.',
    translations: {
      en: {
        question_text:
          'A circular sign with a red border containing two cars side by side (one black, one red) signifies:',
        options: [
          'Overtaking prohibited for all motor vehicles',
          'Dual carriageway begins ahead',
          'Car racing allowed on this sector',
          'Vehicles must drive parallel in two lines',
        ],
        explanation:
          'This sign strictly prohibits overtaking. Drivers must not overtake any motorized vehicle on this stretch.',
      },
      si: {
        question_text:
          'රතු මායිමක් සහිත වෘත්තාකාර සංඥාවක එක ළඟ ඇති මෝටර් රථ දෙකක් (රතු සහ කළු) දැක්වෙන විට ඉන් අදහස් වන්නේ:',
        options: [
          'ඉස්සර කිරීම සම්පූර්ණයෙන්ම තහනම්ය (No Overtaking)',
          'ද්විත්ව මංතීරු මාර්ගය මෙතැනින් ආරම්භ වේ',
          'රථ ධාවන තරඟ සඳහා අවසර ඇත',
          'වාහන සමාන්තර පේළි දෙකකින් ධාවනය කළ යුතුය',
        ],
        explanation:
          'මෙම සංඥාව මගින් ඉදිරියට ඇති මාර්ග කොටසේ වෙනත් මෝටර් වාහන ඉස්සර කිරීම තහනම් කරයි.',
      },
      ta: {
        question_text:
          'சிவப்பு எல்லை கொண்ட வட்டத்தில் பக்கவாட்டில் உள்ள இரண்டு கார்கள் (ஒன்று சிவப்பு) சைகை குறிப்பது:',
        options: [
          'முந்திச் செல்லுதல் தடை செய்யப்பட்டுள்ளது (No Overtaking)',
          'இரட்டை ஒழுங்கை பாதை தொடங்குகிறது',
          'கார் பந்தயங்களுக்கு அனுமதி',
          'வாகனங்கள் இரண்டு வரிசையில் செல்ல வேண்டும்',
        ],
        explanation:
          'இந்த சைகை வாகனங்களை முந்திச் செல்வது முற்றாக தடை செய்யப்பட்டுள்ளதை குறிக்கிறது.',
      },
    },
  },

  // =============================================================
  // 2. WARNING ROAD SIGNS
  // =============================================================
  {
    id: 'q-warn-01',
    category: 'road_signs_warning',
    question_text:
      'An equilateral triangular sign with a red border showing a pedestrian on a zebra crossing indicates:',
    image_url: '⚠️ 🚶',
    options: [
      'Pedestrian crossing (Zebra Crossing) ahead; prepare to slow down and stop',
      'Pedestrians prohibited on this road',
      'School playground area',
      'Bus halt ahead',
    ],
    correct_option_index: 0,
    explanation:
      'Warning signs in Sri Lanka are triangular with red borders. This sign warns of an approaching pedestrian crossing.',
    translations: {
      en: {
        question_text:
          'An equilateral triangular sign with a red border showing a pedestrian on a zebra crossing indicates:',
        options: [
          'Pedestrian crossing (Zebra Crossing) ahead; prepare to slow down and stop',
          'Pedestrians prohibited on this road',
          'School playground area',
          'Bus halt ahead',
        ],
        explanation:
          'Warning signs in Sri Lanka are triangular with red borders. This sign warns of an approaching pedestrian crossing.',
      },
      si: {
        question_text:
          'රතු මායිමක් සහිත ත්‍රිකෝණාකාර සංඥාවක සීබ්‍රා මාරුවක ගමන් කරන පදිකයෙකුගේ රූපයක් ඇති විට ඉන් අදහස් වන්නේ:',
        options: [
          'ඉදිරියෙන් පදික මාරුවක් ඇත; වේගය අඩු කර නැවැත්වීමට සූදානම් වන්න',
          'පදිකයින්ට මෙම මාර්ගයේ ගමන් කිරීම තහනම්',
          'පාසල් ක්‍රීඩා පිටි කලාපයකි',
          'ඉදිරියෙන් බස් නැවතුම්පොළකි',
        ],
        explanation:
          'ත්‍රිකෝණාකාර අනතුරු ඇඟවීමේ සංඥාව මගින් ඉදිරියේ පදික මාරුවක් ඇති බැවින් රියදුරු වේගය අඩු කර ගැනීමට අනතුරු අඟවයි.',
      },
      ta: {
        question_text:
          'சிவப்பு எல்லை கொண்ட முக்கோண சைகையில் பாதசாரி கடவையில் நடக்கும் மனிதனின் உருவம் குறிப்பது:',
        options: [
          'முன்னோக்கி பாதசாரி கடவை (Zebra Crossing) உள்ளது; வேகத்தை குறைத்து நிறுத்த தயாராகுக',
          'வீதியில் பாதசாரிகள் செல்ல தடை',
          'பாடசாலை விளையாட்டு மைதானம்',
          'பேருந்து நிறுத்தம் உள்ளது',
        ],
        explanation:
          'முக்கோண எச்சரிக்கை சைகை முன்னால் பாதசாரி கடவை உள்ளதால் வாகனத்தை மெதுவாக்க அறிவுறுத்துகிறது.',
      },
    },
  },
  {
    id: 'q-warn-02',
    category: 'road_signs_warning',
    question_text:
      'A triangular warning sign displaying a steam locomotive engine alerts the driver to:',
    image_url: '⚠️ 🚂',
    options: [
      'Railway level crossing without gates or barriers ahead',
      'Railway station entrance ahead',
      'Level crossing with automatic barriers ahead',
      'Industrial machinery zone',
    ],
    correct_option_index: 0,
    explanation:
      'A steam locomotive inside a warning triangle indicates an UNGATED railway level crossing. Extreme caution and stopping to check both directions is mandatory.',
    translations: {
      en: {
        question_text:
          'A triangular warning sign displaying a steam locomotive engine alerts the driver to:',
        options: [
          'Railway level crossing without gates or barriers ahead',
          'Railway station entrance ahead',
          'Level crossing with automatic barriers ahead',
          'Industrial machinery zone',
        ],
        explanation:
          'A steam locomotive inside a warning triangle indicates an UNGATED railway level crossing. Extreme caution and stopping to check both directions is mandatory.',
      },
      si: {
        question_text:
          'දුම්රිය එන්ජිමක රූපයක් සහිත ත්‍රිකෝණාකාර අනතුරු ඇඟවීමේ සංඥාවෙන් රියදුරුට අනතුරු අඟවන්නේ:',
        options: [
          'ඉදිරියෙන් ගේට්ටු හෝ බාධක රහිත අනාරක්ෂිත දුම්රිය හරස් මාර්ගයකි',
          'දුම්රිය ස්ථාන පිවිසුමකි',
          'ගේට්ටු සහිත ආරක්ෂිත දුම්රිය හරස් මාර්ගයකි',
          'කාර්මික යන්ත්‍රෝපකරණ කලාපයකි',
        ],
        explanation:
          'දුම්රිය එන්ජිමක රූපය මගින් ගේට්ටු රහිත අනාරක්ෂිත දුම්රිය හරස් මාර්ගයක් ඉදිරියෙන් ඇති බව දන්වයි.',
      },
      ta: {
        question_text:
          'முக்கோண சைகையினுள் நீராவி ரயில் எஞ்சின் படம் இருந்தால் அது எச்சரிப்பது:',
        options: [
          'முன்னால் வாயில்/படலை அற்ற பாதுகாப்பற்ற ரயில் கடவை உள்ளது',
          'ரயில் நிலைய பிரவேசம்',
          'வாயில் உள்ள பாதுகாக்கப்பட்ட ரயில் கடவை',
          'தொழிற்சாலை மண்டலம்',
        ],
        explanation:
          'ரயில் எஞ்சின் படம் முன்னால் வாயில் அல்லது படலை இல்லாத பாதுகாப்பற்ற ரயில் கடவை உள்ளதை உணர்த்துகிறது.',
      },
    },
  },
  {
    id: 'q-warn-03',
    category: 'road_signs_warning',
    question_text:
      'A triangular warning sign showing a car skidding with wavy tracks beneath warns of:',
    image_url: '⚠️ 🚗〰️',
    options: [
      'Slippery road surface ahead; reduce speed and avoid sudden braking',
      'Car racing track zone',
      'Curved mountain bends ahead',
      'Vehicle testing ground',
    ],
    correct_option_index: 0,
    explanation:
      'This sign warns drivers that the road surface may be slippery due to rain, oil, or loose gravel, increasing braking distance.',
    translations: {
      en: {
        question_text:
          'A triangular warning sign showing a car skidding with wavy tracks beneath warns of:',
        options: [
          'Slippery road surface ahead; reduce speed and avoid sudden braking',
          'Car racing track zone',
          'Curved mountain bends ahead',
          'Vehicle testing ground',
        ],
        explanation:
          'This sign warns drivers that the road surface may be slippery due to rain, oil, or loose gravel, increasing braking distance.',
      },
      si: {
        question_text:
          'ලිස්සා යන මෝටර් රථයක රූපයක් සහිත ත්‍රිකෝණාකාර සංඥාවෙන් අනතුරු අඟවන්නේ:',
        options: [
          'ඉදිරියෙන් ලිස්සන සුළු මාර්ගයකි; වේගය අඩු කර හදිසි තිරිංග යෙදීමෙන් වළකින්න',
          'රථ ධාවන පථයකි',
          'ඉදිරියෙන් වංගු සහිත කඳුකර මාර්ගයකි',
          'වාහන පරීක්ෂණ අංගනයකි',
        ],
        explanation:
          'තෙතමනය හෝ වැලි සහිත බව නිසා ඉදිරි මාර්ගය ලිස්සන සුළු බව මෙමගින් අනතුරු අඟවයි.',
      },
      ta: {
        question_text:
          'வழுக்கிச் செல்லும் கார் படம் கொண்ட முக்கோண எச்சரிக்கை சைகை குறிப்பது:',
        options: [
          'முன்னால் வழுக்கும் வீதி; வேகத்தைக் குறைத்து திடீர் பிரேக் போடுவதைத் தவிர்க்கவும்',
          'கார் பந்தய பாதை',
          'மலை வளைவுகள் உள்ளன',
          'வாகன சோதனை தளம்',
        ],
        explanation:
          'வீதி வழுக்கும் தன்மையுடையதாக இருப்பதால் வாகன வேகத்தை குறைத்து செல்ல வேண்டும்.',
      },
    },
  },
  {
    id: 'q-warn-04',
    category: 'road_signs_warning',
    question_text:
      'A warning sign depicting a fence or gate structure inside a red triangle means:',
    image_url: '⚠️ 🚧',
    options: [
      'Railway level crossing with gates or barriers ahead',
      'Farm boundary fence ahead',
      'Road closed permanently',
      'Construction zone perimeter',
    ],
    correct_option_index: 0,
    explanation:
      'The fence symbol warns of an approaching railway level crossing equipped with gates or automatic boom barriers.',
    translations: {
      en: {
        question_text:
          'A warning sign depicting a fence or gate structure inside a red triangle means:',
        options: [
          'Railway level crossing with gates or barriers ahead',
          'Farm boundary fence ahead',
          'Road closed permanently',
          'Construction zone perimeter',
        ],
        explanation:
          'The fence symbol warns of an approaching railway level crossing equipped with gates or automatic boom barriers.',
      },
      si: {
        question_text:
          'රතු ත්‍රිකෝණයක් තුළ වැටක් හෝ ගේට්ටුවක් නිරූපණය කරන සංඥාවෙන් අදහස් වන්නේ:',
        options: [
          'ඉදිරියෙන් ගේට්ටු සහිත ආරක්ෂිත දුම්රිය හරස් මාර්ගයකි',
          'ගොවිපල වැටකි',
          'මාර්ගය ස්ථිරවම වසා ඇත',
          'ඉදිකිරීම් සීමාවකි',
        ],
        explanation:
          'වැටක රූපය මගින් ගේට්ටු හෝ බාධක සහිත ආරක්ෂිත දුම්රිය හරස් මාර්ගයක් ඉදිරියෙන් ඇති බව දන්වයි.',
      },
      ta: {
        question_text:
          'சிவப்பு முக்கோணத்தில் வேலி அல்லது படலை படம் உள்ள சைகை குறிப்பது:',
        options: [
          'முன்னால் படலை/வாயில் உள்ள பாதுகாக்கப்பட்ட ரயில் கடவை உள்ளது',
          'பண்ணை வேலி',
          'வீதி நிரந்தரமாக மூடப்பட்டுள்ளது',
          'கட்டுமான எல்லை',
        ],
        explanation:
          'வேலி அடையாளம் முன்னால் வாயில் உள்ள பாதுகாக்கப்பட்ட ரயில் கடவையை குறிக்கிறது.',
      },
    },
  },

  // =============================================================
  // 3. PRIORITY & JUNCTIONS
  // =============================================================
  {
    id: 'q-prio-01',
    category: 'priority_and_junctions',
    question_text:
      'When approaching an uncontrolled 4-way intersection in Sri Lanka with no traffic lights or signs, which vehicle has the right of way?',
    options: [
      'The vehicle approaching from your right-hand side',
      'The fastest vehicle regardless of direction',
      'The larger commercial heavy vehicle',
      'The vehicle on your left-hand side',
    ],
    correct_option_index: 0,
    explanation:
      'Under Sri Lankan road priority rules, at an uncontrolled junction with equal road status, drivers must give way to traffic approaching from their RIGHT.',
    translations: {
      en: {
        question_text:
          'When approaching an uncontrolled 4-way intersection in Sri Lanka with no traffic lights or signs, which vehicle has the right of way?',
        options: [
          'The vehicle approaching from your right-hand side',
          'The fastest vehicle regardless of direction',
          'The larger commercial heavy vehicle',
          'The vehicle on your left-hand side',
        ],
        explanation:
          'Under Sri Lankan road priority rules, at an uncontrolled junction with equal road status, drivers must give way to traffic approaching from their RIGHT.',
      },
      si: {
        question_text:
          'සංඥා හෝ මාර්ග සලකුණු නොමැති අනාරක්ෂිත සිව්මං හන්දියකට ළඟා වන විට ප්‍රමුඛතාව හිමි වන්නේ කුමන වාහනයටද?',
        options: [
          'ඔබේ දකුණු පසින් පැමිණෙන වාහනයට',
          'දිශාව කුමක් වුවත් වේගයෙන්ම එන වාහනයට',
          'ප්‍රමාණයෙන් විශාල බර වාහනයට',
          'ඔබේ වම් පසින් පැමිණෙන වාහනයට',
        ],
        explanation:
          'ප්‍රමුඛතා නීති රීති අනුව, සලකුණු නොමැති හන්දියකදී තම දකුණු පසින් පැමිණෙන වාහන වලට ප්‍රමුඛතාවය ලබා දිය යුතුය.',
      },
      ta: {
        question_text:
          'சைகைகள் இல்லாத நான்கு சந்திப்பில் எத்திசையில் இருந்து வரும் வாகனத்திற்கு முன்னுரிமை உண்டு?',
        options: [
          'உங்கள் வலதுபுறத்தில் இருந்து வரும் வாகனத்திற்கு',
          'வேகமாக வரும் வாகனத்திற்கு',
          'பெரிய கனரக வாகனத்திற்கு',
          'உங்கள் இடதுபுறத்தில் இருந்து வரும் வாகனத்திற்கு',
        ],
        explanation:
          'சைகைகள் இல்லாத சந்திகளில் வலதுபுறத்தில் இருந்து வரும் வாகனத்திற்கு வழிவிட வேண்டும்.',
      },
    },
  },
  {
    id: 'q-prio-02',
    category: 'priority_and_junctions',
    question_text:
      'What is the legal driving rule regarding Yellow Box Junctions painted on Sri Lankan roads?',
    options: [
      'You must not enter the yellow box unless your exit road is clear, except when turning right',
      'You can stop inside the box at any time if traffic is heavy',
      'Buses and three-wheelers can park inside the box',
      'You can only enter when the light is green, regardless of exit space',
    ],
    correct_option_index: 0,
    explanation:
      'Drivers must never enter a yellow box junction unless their exit is completely clear. The only exception is when waiting to turn right and oncoming traffic prevents completion.',
    translations: {
      en: {
        question_text:
          'What is the legal driving rule regarding Yellow Box Junctions painted on Sri Lankan roads?',
        options: [
          'You must not enter the yellow box unless your exit road is clear, except when turning right',
          'You can stop inside the box at any time if traffic is heavy',
          'Buses and three-wheelers can park inside the box',
          'You can only enter when the light is green, regardless of exit space',
        ],
        explanation:
          'Drivers must never enter a yellow box junction unless their exit is completely clear. The only exception is when waiting to turn right and oncoming traffic prevents completion.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ මාර්ග හන්දිවල ඇති කහ පැහැති කොටු දැල (Yellow Box Junction) සම්බන්ධ නීතිය කුමක්ද?',
        options: [
          'පිටවීමේ මාර්ගය පැහැදිලිව නොමැති නම් කහ කොටුව තුළට ඇතුළු නොවිය යුතුය (දකුණට හැරවීම හැර)',
          'තදබදය වැඩි නම් කොටුව තුළ වාහනය නතර කර තැබිය හැක',
          'බස් සහ ත්‍රිරෝද රථ වලට කොටුව තුළ නැවැත්විය හැක',
          'කොළ එළිය ඇති විට පිටවීම අවහිර වුවද ඇතුළු විය හැක',
        ],
        explanation:
          'කහ කොටු දැලක් තුළට ඇතුළු විය හැක්කේ පිටවීමේ මාර්ගය සම්පූර්ණයෙන්ම පැහැදිලිව ඇත්නම් පමණි. දකුණට හැරවීමේදී පමණක් ව්‍යතිරේකයක් පවතී.',
      },
      ta: {
        question_text:
          'வீதிகளில் வரையப்பட்டுள்ள மஞ்சள் பெட்டி சந்தி (Yellow Box Junction) தொடர்பான சட்டம் யாது?',
        options: [
          'வெளியேறும் பாதை தெளிவாக இல்லாவிட்டால் மஞ்சள் பெட்டிக்குள் நுழையக்கூடாது (வலதுபுறம் திரும்புவதைத் தவிர)',
          'போக்குவரத்து நெரிசல் இருப்பின் பெட்டிக்குள் வாகனத்தை நிறுத்தலாம்',
          'பேருந்துகள் மற்றும் முச்சக்கர வண்டிகள் பெட்டியினுள் நிற்கலாம்',
          'பச்சை விளக்கு எரியும்போது வெளியேறும் வழி அடைக்கப்பட்டிருந்தாலும் நுழையலாம்',
        ],
        explanation:
          'வெளியேறும் பாதை தெளிவாக இருக்கும்போது மட்டுமே மஞ்சள் பெட்டிக்குள் நுழைய வேண்டும்.',
      },
    },
  },
  {
    id: 'q-prio-03',
    category: 'priority_and_junctions',
    question_text:
      'When circulating a roundabout in Sri Lanka, which traffic has priority?',
    options: [
      'Traffic already circulating on the roundabout from your right',
      'Vehicles entering the roundabout at highest speed',
      'Long-distance buses entering from the left',
      'Pedestrians crossing anywhere on the roundabout',
    ],
    correct_option_index: 0,
    explanation:
      'In Sri Lanka (left-hand drive road network), vehicles already in the roundabout coming from your right have absolute right of way.',
    translations: {
      en: {
        question_text:
          'When circulating a roundabout in Sri Lanka, which traffic has priority?',
        options: [
          'Traffic already circulating on the roundabout from your right',
          'Vehicles entering the roundabout at highest speed',
          'Long-distance buses entering from the left',
          'Pedestrians crossing anywhere on the roundabout',
        ],
        explanation:
          'In Sri Lanka (left-hand drive road network), vehicles already in the roundabout coming from your right have absolute right of way.',
      },
      si: {
        question_text:
          'වටරවුමකට ඇතුළු වීමේදී ප්‍රමුඛතාවය හිමි වන්නේ කාටද?',
        options: [
          'වටරවුමේ දකුණු පසින් දැනටමත් ගමන් කරමින් සිටින වාහන වලට',
          'වැඩි වේගයකින් ඇතුළු වන වාහන වලට',
          'වම් පසින් ඇතුළු වන දුරගමන් බස් රථ වලට',
          'වටරවුම හරහා ගමන් කරන පදිකයින්ට',
        ],
        explanation:
          'වටරවුමකදී සැමවිටම තම දකුණු පසින් වටරවුම තුළ දැනටමත් ධාවනය වන වාහන සඳහා ප්‍රමුඛතාවය ලබා දිය යුතුය.',
      },
      ta: {
        question_text:
          'வட்டச்சுற்றில் (Roundabout) நுழையும் போது யாருக்கு முன்னுரிமை அளிக்க வேண்டும்?',
        options: [
          'வட்டச்சுற்றில் வலதுபுறத்தில் ஏற்கனவே பயணிக்கும் வாகனங்களுக்கு',
          'வேகமாக நுழையும் வாகனங்களுக்கு',
          'இடதுபுறத்தில் இருந்து வரும் நீண்டதூர பேருந்துகளுக்கு',
          'வட்டச்சுற்றை கடக்கும் பாதசாரிகளுக்கு',
        ],
        explanation:
          'வட்டச்சுற்றில் ஏற்கனவே வலதுபுறத்திலிருந்து சுற்றிக்கொண்டிருக்கும் வாகனங்களுக்கே முன்னுரிமை உண்டு.',
      },
    },
  },

  // =============================================================
  // 4. GENERAL ROAD SAFETY & HIGHWAY CODE
  // =============================================================
  {
    id: 'q-safe-01',
    category: 'general_road_safety',
    question_text:
      'What is the maximum legal Blood Alcohol Concentration (BAC) permitted for driving a motor vehicle in Sri Lanka?',
    options: [
      '0.06 grams per 100 milliliters of blood (0.06% BAC)',
      '0.15 grams per 100 milliliters of blood',
      '0.50 grams per 100 milliliters of blood',
      'There is no limit if driving under 40 km/h',
    ],
    correct_option_index: 0,
    explanation:
      'Under the Sri Lanka Motor Traffic Act, the legal threshold for blood alcohol concentration is 0.06g/100ml (0.06%). Operating a motor vehicle above this is a severe criminal offense.',
    translations: {
      en: {
        question_text:
          'What is the maximum legal Blood Alcohol Concentration (BAC) permitted for driving a motor vehicle in Sri Lanka?',
        options: [
          '0.06 grams per 100 milliliters of blood (0.06% BAC)',
          '0.15 grams per 100 milliliters of blood',
          '0.50 grams per 100 milliliters of blood',
          'There is no limit if driving under 40 km/h',
        ],
        explanation:
          'Under the Sri Lanka Motor Traffic Act, the legal threshold for blood alcohol concentration is 0.06g/100ml (0.06%). Operating a motor vehicle above this is a severe criminal offense.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ මෝටර් රථයක් පැදවීමේදී රුධිරයේ තිබිය හැකි උපරිම නීත්‍යානුකූල මධ්‍යසාර සාන්ද්‍රණය (BAC) කොපමණද?',
        options: [
          'රුධිරය මිලිලීටර් 100 කට ග්‍රෑම් 0.06 (0.06% BAC)',
          'රුධිරය මිලිලීටර් 100 කට ග්‍රෑම් 0.15',
          'රුධිරය මිලිලීටර් 100 කට ග්‍රෑම් 0.50',
          'පැයට කි.මී. 40ට අඩුවෙන් ධාවනය කරන්නේ නම් සීමාවක් නොමැත',
        ],
        explanation:
          'මෝටර් රථ පනතට අනුව නීත්‍යානුකූල මධ්‍යසාර සීමාව 0.06g/100ml වේ. ඊට වඩා මධ්‍යසාර ප්‍රමාණයක් සහිතව රිය පැදවීම දඬුවම් ලැබිය හැකි වරදකි.',
      },
      ta: {
        question_text:
          'இலங்கையில் மோட்டார் வாகனத்தை செலுத்தும் போது அனுமதிக்கப்பட்ட அதிகபட்ச இரத்த மதுபான செறிவு (BAC) வரம்பு யாது?',
        options: [
          '100 மில்லிலீட்டர் இரத்தத்திற்கு 0.06 கிராம் (0.06% BAC)',
          '100 மில்லிலீட்டர் இரத்தத்திற்கு 0.15 கிராம்',
          '100 மில்லிலீட்டர் இரத்தத்திற்கு 0.50 கிராம்',
          '40 km/h வேகத்திற்கு குறைவாக செலுத்தினால் வரம்பு இல்லை',
        ],
        explanation:
          'மோட்டார் போக்குவரத்து சட்டத்தின் கீழ் சட்டப்பூர்வ மதுபான வரம்பு 0.06g/100ml ஆகும்.',
      },
    },
  },
  {
    id: 'q-safe-02',
    category: 'general_road_safety',
    question_text:
      'What is the minimum legal distance a driver must maintain when parking a vehicle before or after a pedestrian (zebra) crossing?',
    options: [
      '15 meters from the crossing',
      '2 meters from the crossing',
      '30 meters from the crossing',
      'Directly adjacent to the white zig-zag line',
    ],
    correct_option_index: 0,
    explanation:
      'Parking within 15 meters of a pedestrian zebra crossing in Sri Lanka is strictly prohibited to ensure oncoming drivers and crossing pedestrians have unobstructed sightlines.',
    translations: {
      en: {
        question_text:
          'What is the minimum legal distance a driver must maintain when parking a vehicle before or after a pedestrian (zebra) crossing?',
        options: [
          '15 meters from the crossing',
          '2 meters from the crossing',
          '30 meters from the crossing',
          'Directly adjacent to the white zig-zag line',
        ],
        explanation:
          'Parking within 15 meters of a pedestrian zebra crossing in Sri Lanka is strictly prohibited to ensure oncoming drivers and crossing pedestrians have unobstructed sightlines.',
      },
      si: {
        question_text:
          'පදික මාරුවකට (සීබ්‍රා මාරුව) ආසන්නව වාහනයක් නැවැත්වීමේදී පවත්වා ගත යුතු අවම නීත්‍යානුකූල දුර කොපමණද?',
        options: [
          'පදික මාරුවේ සිට මීටර් 15 ක්',
          'පදික මාරුවේ සිට මීටර් 2 ක්',
          'පදික මාරුවේ සිට මීටර් 30 ක්',
          'සිග්-සැග් රේඛාව මත',
        ],
        explanation:
          'පදිකයින්ගේ සහ රියදුරන්ගේ දෘශ්‍යතාව පැහැදිලිව තබා ගැනීම සඳහා පදික මාරුවකට මීටර් 15 ක් ඇතුළත වාහන නැවැත්වීම තහනම්ය.',
      },
      ta: {
        question_text:
          'பாதசாரி கடவைக்கு அருகில் வாகனத்தை நிறுத்துவதற்கு பேண வேண்டிய குறைந்தபட்ச தூரம் யாது?',
        options: [
          'பாதசாரி கடவையிலிருந்து 15 மீட்டர்கள்',
          'பாதசாரி கடவையிலிருந்து 2 மீட்டர்கள்',
          'பாதசாரி கடவையிலிருந்து 30 மீட்டர்கள்',
          'வெள்ளை கோட்டின் அருகாமையில்',
        ],
        explanation:
          'பாதசாரிகள் மற்றும் சாரதிகளின் பார்வை தெளிவாக இருக்க பாதசாரி கடவையில் இருந்து 15 மீற்றருக்குள் வாகனம் நிறுத்துவது தடை செய்யப்பட்டுள்ளது.',
      },
    },
  },
  {
    id: 'q-safe-03',
    category: 'general_road_safety',
    question_text:
      'What is the "Two-Second Rule" used for in safe driving practices?',
    options: [
      'Maintaining a safe following distance from the vehicle ahead in dry road conditions',
      'The time taken to change a gear',
      'The duration to look into rearview mirrors before overtaking',
      'The maximum allowed horn sounding time',
    ],
    correct_option_index: 0,
    explanation:
      'The 2-second rule ensures a driver has adequate stopping distance behind the preceding vehicle under normal dry weather conditions. In wet weather, this should be doubled to 4 seconds.',
    translations: {
      en: {
        question_text:
          'What is the "Two-Second Rule" used for in safe driving practices?',
        options: [
          'Maintaining a safe following distance from the vehicle ahead in dry road conditions',
          'The time taken to change a gear',
          'The duration to look into rearview mirrors before overtaking',
          'The maximum allowed horn sounding time',
        ],
        explanation:
          'The 2-second rule ensures a driver has adequate stopping distance behind the preceding vehicle under normal dry weather conditions. In wet weather, this should be doubled to 4 seconds.',
      },
      si: {
        question_text:
          'ආරක්ෂිත රිය ධාවනයේදී "තත්පර දෙකේ නීතිය" (Two-Second Rule) භාවිත වන්නේ කුමකටද?',
        options: [
          'සාමාන්‍ය වියළි කාලගුණයේදී ඉදිරියෙන් ඇති වාහනයෙන් ආරක්ෂිත දුරක් පවත්වා ගැනීමට',
          'ගියරයක් මාරු කිරීමට ගතවන කාලය මැනීමට',
          'ඉස්සර කිරීමට පෙර කණ්නාඩිය බැලිය යුතු කාලය',
          'නලා ශබ්ද කළ හැකි උපරිම කාලය',
        ],
        explanation:
          'වියළි මාර්ග තත්ත්ව යටතේ ඉදිරිපස වාහනයෙන් ප්‍රමාණවත් ආරක්ෂිත පරතරයක් තබා ගැනීමට තත්පර 2ක නීතිය භාවිතා කරයි.',
      },
      ta: {
        question_text:
          'பாதுகாப்பான வாகன ஓட்டலில் "இரண்டு வினாடி விதி" (Two-Second Rule) எதற்காக பயன்படுகிறது?',
        options: [
          'முன்னால் செல்லும் வாகனத்திலிருந்து பாதுகாப்பான இடைவெளியைப் பேண',
          'கியர் மாற்றுவதற்கு எடுக்கும் நேரம்',
          'முந்துவதற்கு முன் கண்ணாடியைப் பார்க்க வேண்டிய நேரம்',
          'ஒலிப்பானை (ஹோர்ன்) ஒலிக்கும் அதிகபட்ச நேரம்',
        ],
        explanation:
          'முன்னால் செல்லும் வாகனத்திலிருந்து தகுந்த நிறுத்த இடைவெளியை பராமரிக்க 2 வினாடி விதி உதவுகிறது.',
      },
    },
  },
  {
    id: 'q-safe-04',
    category: 'general_road_safety',
    question_text:
      'When an emergency vehicle (ambulance, fire engine, or police vehicle) approaches with flashing emergency lights and siren active, what action should you take?',
    options: [
      'Move safely to the left edge of the road, slow down, and stop if necessary to clear a path',
      'Accelerate rapidly to stay ahead of the emergency vehicle',
      'Stop immediately in the center of the lane',
      'Follow closely behind the ambulance to bypass heavy traffic',
    ],
    correct_option_index: 0,
    explanation:
      'All motorists must immediately yield right of way to emergency service vehicles by safely moving to the left side and creating an unobstructed lane.',
    translations: {
      en: {
        question_text:
          'When an emergency vehicle (ambulance, fire engine, or police vehicle) approaches with flashing emergency lights and siren active, what action should you take?',
        options: [
          'Move safely to the left edge of the road, slow down, and stop if necessary to clear a path',
          'Accelerate rapidly to stay ahead of the emergency vehicle',
          'Stop immediately in the center of the lane',
          'Follow closely behind the ambulance to bypass heavy traffic',
        ],
        explanation:
          'All motorists must immediately yield right of way to emergency service vehicles by safely moving to the left side and creating an unobstructed lane.',
      },
      si: {
        question_text:
          'හදිසි ආපදා සේවා වාහනයක් (ගිලන් රථ, ගිනි නිවන රථ හෝ පොලිස් රථ) සයිරන් නාද කරමින් පැමිණෙන විට ඔබ කළ යුත්තේ කුමක්ද?',
        options: [
          'ආරක්ෂිතව මාර්ගයේ වම් පසට කර වේගය අඩු කර අවශ්‍ය නම් නවත්වා ඉඩ ලබා දීම',
          'ගිලන් රථයට වඩා වේගයෙන් ඉදිරියට ධාවනය කිරීම',
          'මංතීරුව මැද හදිසියේම වාහනය නැවැත්වීම',
          'තදබදය මඟ හැරීමට ගිලන් රථය පිටුපසින්ම ළඟින් ධාවනය කිරීම',
        ],
        explanation:
          'හදිසි ආපදා වාහන වලට බාධාවකින් තොරව ගමන් කිරීමට මාර්ගයේ වම් පසට කර ඉඩ ලබා දීම අනිවාර්ය නීතියකි.',
      },
      ta: {
        question_text:
          'அவசர சிகிச்சை ஊர்தி (ஆம்புலன்ஸ்/தீயணைப்பு) சைரன் ஒலியுடன் வரும் போது நீங்கள் என்ன செய்ய வேண்டும்?',
        options: [
          'பாதுகாப்பாக வீதியின் இடதுபுறமாக சென்று வேகத்தை குறைத்து அல்லது நிறுத்தி வழிவிடவும்',
          'அவசர ஊர்தியை விட வேகமாக செல்லவும்',
          'ஒழுங்கையின் நடுவில் திடீரென நிறுத்தவும்',
          'நெரிசலை தவிர்க்க ஆம்புலன்ஸின் பின்னால் தொடர்ந்து செல்லவும்',
        ],
        explanation:
          'அவசர கால வாகனங்களுக்கு உடனடியாக இடதுபுறமாக சென்று தடையற்ற பாதையை வழங்குவது கட்டாயமாகும்.',
      },
    },
  },

  // =============================================================
  // 5. VEHICLE MECHANICS, CONTROLS & EMERGENCIES
  // =============================================================
  {
    id: 'q-mech-01',
    category: 'vehicle_mechanics_controls',
    question_text:
      'If your foot brake suddenly fails while driving down a steep slope, what is the safest recovery sequence?',
    options: [
      'Pump the brake pedal, downshift progressively to lower gears (engine braking), and apply the handbrake gradually',
      'Turn off the engine ignition immediately while traveling at speed',
      'Steer straight off the edge into a ditch immediately',
      'Shift the transmission into neutral and wait for the car to stop',
    ],
    correct_option_index: 0,
    explanation:
      'Pumping can build residual hydraulic pressure. Downshifting uses engine compression braking, and gradual handbrake engagement slows the wheels without locking them into a skid.',
    translations: {
      en: {
        question_text:
          'If your foot brake suddenly fails while driving down a steep slope, what is the safest recovery sequence?',
        options: [
          'Pump the brake pedal, downshift progressively to lower gears (engine braking), and apply the handbrake gradually',
          'Turn off the engine ignition immediately while traveling at speed',
          'Steer straight off the edge into a ditch immediately',
          'Shift the transmission into neutral and wait for the car to stop',
        ],
        explanation:
          'Pumping can build residual hydraulic pressure. Downshifting uses engine compression braking, and gradual handbrake engagement slows the wheels without locking them into a skid.',
      },
      si: {
        question_text:
          'බෑවුම් සහිත මාර්ගයක ධාවනය වන විට පාද තිරිංග (Foot brake) ක්‍රියාවිරහිත වුවහොත් ගත යුතු වඩාත්ම ආරක්ෂිත පියවර කුමක්ද?',
        options: [
          'තිරිංග පැඩලය කිහිපවරක් පාගා, ක්‍රමයෙන් පහළ ගියරයකට දමා (Engine brake), අත් තිරිංගය (Handbrake) ක්‍රමයෙන් යෙදීම',
          'වේගයෙන් ගමන් කරන අතරතුර වාහනයේ එන්ජිම සම්පූර්ණයෙන්ම ක්‍රියා විරහිත කිරීම',
          'වාහනය වහාම කානුවකට හැරවීම',
          'ගියර් Neutral (නිදහස්) කර තනිව නවතින තුරු සිටීම',
        ],
        explanation:
          'තිරිංග ක්‍රියාවිරහිත වූ විට එන්ජින් තිරිංගය (ක්‍රමයෙන් පහළ ගියර් වලට මාරු කිරීම) සහ අත් තිරිංග ක්‍රමයෙන් යෙදීම ආරක්ෂිතම ක්‍රමයයි.',
      },
      ta: {
        question_text:
          'செங்குத்தான சரிவில் செல்லும்போது பிரேக் செயலிழந்தால் நீங்கள் செய்ய வேண்டிய பாதுகாப்பான நடவடிக்கை யாது?',
        options: [
          'பிரேக்கை பலமுறை அழுத்தி, படிப்படியாக குறைந்த கியருக்கு மாற்றி (Engine brake), கை பிரேக்கை மெதுவாக இழுக்கவும்',
          'வாகனம் வேகமாக செல்லும்போது இயந்திரத்தை அணைக்கவும்',
          'உடனடியாக வாகனத்தை பள்ளத்தில் செலுத்தவும்',
          'கியரை நியூட்ரலில் விட்டு வாகனம் நிற்கும் வரை காத்திருக்கவும்',
        ],
        explanation:
          'கியரை குறைத்து என்ஜின் பிரேக் மூலம் வேகத்தை கட்டுப்படுத்தி கை பிரேக்கை படிப்படியாக பயன்படுத்துவதே சரியானது.',
      },
    },
  },
  {
    id: 'q-mech-02',
    category: 'vehicle_mechanics_controls',
    question_text:
      'If a tire suddenly bursts / blows out while driving at 80 km/h on a highway, what should you do?',
    options: [
      'Grip the steering wheel firmly with both hands, release the accelerator, and allow the car to decelerate gradually without hard braking',
      'Slam on the foot brake with maximum force immediately',
      'Pull the emergency handbrake instantly to maximum position',
      'Turn the steering wheel rapidly to the opposite side of the blown tire',
    ],
    correct_option_index: 0,
    explanation:
      'Hard braking or sudden steering during a blowout causes a violent rollover or spin. Keep the vehicle straight and decelerate smoothly before pulling over.',
    translations: {
      en: {
        question_text:
          'If a tire suddenly bursts / blows out while driving at 80 km/h on a highway, what should you do?',
        options: [
          'Grip the steering wheel firmly with both hands, release the accelerator, and allow the car to decelerate gradually without hard braking',
          'Slam on the foot brake with maximum force immediately',
          'Pull the emergency handbrake instantly to maximum position',
          'Turn the steering wheel rapidly to the opposite side of the blown tire',
        ],
        explanation:
          'Hard braking or sudden steering during a blowout causes a violent rollover or spin. Keep the vehicle straight and decelerate smoothly before pulling over.',
      },
      si: {
        question_text:
          'අධිවේගී මාර්ගයක පැයට කි.මී. 80 ක වේගයෙන් ගමන් කරන විට ටයරයක් පුපුරා ගියහොත් ඔබ කළ යුත්තේ කුමක්ද?',
        options: [
          'සුක්කානම දෑතින්ම තදින් අල්ලාගෙන, ඇක්සලරේටරය අතහැර තදින් තිරිංග නොයොදා වාහනයේ වේගය ක්‍රමයෙන් අඩු වීමට ඉඩ හැරීම',
          'වහාම උපරිම බලයෙන් පාද තිරිංග (Foot brake) තද කිරීම',
          'ක්ෂණිකව අත් තිරිංග (Handbrake) උපරිමයට ඇදීම',
          'සුක්කානම අනෙක් පැත්තට වේගයෙන් කැරකවීම',
        ],
        explanation:
          'ටයරයක් පිපිරූ විට තදින් තිරිංග යෙදීමෙන් වාහනය පෙරළී යා හැක. සුක්කානම කෙළින් තබා ගනිමින් වේගය ක්‍රමයෙන් අඩු කරගත යුතුය.',
      },
      ta: {
        question_text:
          'நெடுஞ்சாலையில் 80 km/h வேகத்தில் செல்லும்போது ரயர் வெடித்தால் நீங்கள் என்ன செய்ய வேண்டும்?',
        options: [
          'ஸ்டீயரிங்கை இரு கைகளாலும் இறுக்கமாகப் பிடித்து, அக்ஸிலேட்டரை விடுவித்து, பிரேக் அடிக்காமல் வாகனத்தை மெதுவாக நிறுத்தவும்',
          'உடனடியாக கடுமையான பிரேக் போடவும்',
          'உடனடியாக கை பிரேக்கை முழுமையாக இழுக்கவும்',
          'ஸ்டீயரிங்கை எதிர்பக்கமாக வேகமாக திருப்பவும்',
        ],
        explanation:
          'ரயர் வெடிக்கும் போது கடுமையான பிரேக் போடுவதால் வாகனம் கவிழும் அபாயம் உள்ளது. சீரான முறையில் வேகத்தை குறைத்து நிறுத்த வேண்டும்.',
      },
    },
  },
  {
    id: 'q-mech-03',
    category: 'vehicle_mechanics_controls',
    question_text:
      'What should a driver do if the car begins to hydroplane (aquaplane) over standing water on a rainy highway?',
    options: [
      'Ease off the accelerator pedal gently, avoid sudden braking, and maintain a steady straight steering line until tires regain grip',
      'Press the accelerator pedal to slice through the water layer',
      'Apply harsh anti-lock braking to lock the wheels',
      'Turn the steering wheel back and forth rapidly',
    ],
    correct_option_index: 0,
    explanation:
      'During hydroplaning, tires float on water without road contact. Easing off the throttle allows water to disperse and the tread to grip asphalt again.',
    translations: {
      en: {
        question_text:
          'What should a driver do if the car begins to hydroplane (aquaplane) over standing water on a rainy highway?',
        options: [
          'Ease off the accelerator pedal gently, avoid sudden braking, and maintain a steady straight steering line until tires regain grip',
          'Press the accelerator pedal to slice through the water layer',
          'Apply harsh anti-lock braking to lock the wheels',
          'Turn the steering wheel back and forth rapidly',
        ],
        explanation:
          'During hydroplaning, tires float on water without road contact. Easing off the throttle allows water to disperse and the tread to grip asphalt again.',
      },
      si: {
        question_text:
          'වැසි සහිත මාර්ගයක ජලය රැඳුණු ස්ථානයකදී වාහනය ලිස්සා යාම (Hydroplaning / Aquaplaning) සිදුවුවහොත් කළ යුත්තේ කුමක්ද?',
        options: [
          'ඇක්සලරේටරය ක්‍රමයෙන් මුදාහැර, හදිසි තිරිංග නොයොදා ටයර් නැවත මාර්ගයේ ග්‍රහණය වනතුරු සුක්කානම කෙළින් තබා ගැනීම',
          'වතුර කපාගෙන යාමට ඇක්සලරේටරය තද කිරීම',
          'හදිසි තිරිංග තදින් යෙදීම',
          'සුක්කානම දෙපසට වේගයෙන් කරකැවීම',
        ],
        explanation:
          'ජල තට්ටුවක් මත ටයර් ලිස්සා යන විට තිරිංග නොයොදා වේගය ලිහිල් කර ටයර් වලට මාර්ගය ස්පර්ශ වීමට ඉඩ දිය යුතුය.',
      },
      ta: {
        question_text:
          'மழைக்காலத்தில் வீதியில் தேங்கியுள்ள நீரில் வாகனம் வழுக்கும் போது (Aquaplaning) என்ன செய்ய வேண்டும்?',
        options: [
          'அக்ஸிலேட்டரை மெதுவாக குறைத்து, பிரேக் அடிக்காமல் ரயர்கள் மீண்டும் வீதியை பற்றும் வரை நேராக செலுத்தவும்',
          'நீரை கடக்க வேகத்தை கூட்டவும்',
          'கடுமையாக பிரேக் அடிக்கவும்',
          'ஸ்டீயரிங்கை இருபுறமும் அசைக்கவும்',
        ],
        explanation:
          'நீரில் வழுக்கும் போது திடீர் பிரேக் போடாமல் வேகத்தை குறைத்து வாகனத்தை நேராக வைத்திருக்க வேண்டும்.',
      },
    },
  },

  // =============================================================
  // 6. INFORMATIVE & EXPRESSWAY SIGNS
  // =============================================================
  {
    id: 'q-info-01',
    category: 'road_signs_informative',
    question_text:
      'What are the minimum and maximum legal speed limits for cars on Sri Lankan Expressways (e.g., E01 Southern Expressway)?',
    image_url: '🛣️ 100',
    options: [
      'Minimum: 40 km/h | Maximum: 100 km/h',
      'Minimum: 20 km/h | Maximum: 70 km/h',
      'Minimum: 60 km/h | Maximum: 140 km/h',
      'No minimum limit | Maximum: 80 km/h',
    ],
    correct_option_index: 0,
    explanation:
      'On Sri Lankan Expressways, the minimum legal speed is 40 km/h (to prevent hazardous slow obstruction) and maximum is 100 km/h for passenger motor cars.',
    translations: {
      en: {
        question_text:
          'What are the minimum and maximum legal speed limits for cars on Sri Lankan Expressways (e.g., E01 Southern Expressway)?',
        options: [
          'Minimum: 40 km/h | Maximum: 100 km/h',
          'Minimum: 20 km/h | Maximum: 70 km/h',
          'Minimum: 60 km/h | Maximum: 140 km/h',
          'No minimum limit | Maximum: 80 km/h',
        ],
        explanation:
          'On Sri Lankan Expressways, the minimum legal speed is 40 km/h (to prevent hazardous slow obstruction) and maximum is 100 km/h for passenger motor cars.',
      },
      si: {
        question_text:
          'ශ්‍රී ලංකාවේ අධිවේගී මාර්ගවල (උදා: E01 දක්ෂිණ අධිවේගී මාර්ගය) මෝටර් රථ සඳහා වන අවම සහ උපරිම වේග සීමාවන් මොනවාද?',
        options: [
          'අවම: පැයට කි.මී. 40 | උපරිම: පැයට කි.මී. 100',
          'අවම: පැයට කි.මී. 20 | උපරිම: පැයට කි.මී. 70',
          'අවම: පැයට කි.මී. 60 | උපරිම: පැයට කි.මී. 140',
          'අවම සීමාවක් නොමැත | උපරිම: පැයට කි.මී. 80',
        ],
        explanation:
          'ශ්‍රී ලංකාවේ අධිවේගී මාර්ගවල මෝටර් රථ සඳහා නීත්‍යානුකූල අවම වේගය 40 km/h වන අතර උපරිම වේගය 100 km/h වේ.',
      },
      ta: {
        question_text:
          'இலங்கை அதிவேக நெடுஞ்சாலைகளில் கார்களுக்கான குறைந்தபட்ச மற்றும் அதிகபட்ச வேக வரம்புகள் என்ன?',
        options: [
          'குறைந்தபட்சம்: 40 km/h | அதிகபட்சம்: 100 km/h',
          'குறைந்தபட்சம்: 20 km/h | அதிகபட்சம்: 70 km/h',
          'குறைந்தபட்சம்: 60 km/h | அதிகபட்சம்: 140 km/h',
          'குறைந்தபட்ச வரம்பு இல்லை | அதிகபட்சம்: 80 km/h',
        ],
        explanation:
          'அதிவேக நெடுஞ்சாலையில் குறைந்தபட்ச வேகம் 40 km/h மற்றும் அதிகபட்ச வேகம் 100 km/h ஆகும்.',
      },
    },
  },
  {
    id: 'q-info-02',
    category: 'road_signs_informative',
    question_text:
      'A blue rectangular sign featuring a white capital letter "H" on Sri Lankan roads designates:',
    image_url: '🏥 H',
    options: [
      'Hospital / medical treatment facility ahead (Maintain silence, no unnecessary horn blowing)',
      'Helipad / Helicopter landing site',
      'Hotel or resort accommodation',
      'Highway exit ramp',
    ],
    correct_option_index: 0,
    explanation:
      'The "H" informative sign indicates a Hospital or medical emergency zone. Drivers must refrain from sounding horns or creating noise disturbances in this sector.',
    translations: {
      en: {
        question_text:
          'A blue rectangular sign featuring a white capital letter "H" on Sri Lankan roads designates:',
        options: [
          'Hospital / medical treatment facility ahead (Maintain silence, no unnecessary horn blowing)',
          'Helipad / Helicopter landing site',
          'Hotel or resort accommodation',
          'Highway exit ramp',
        ],
        explanation:
          'The "H" informative sign indicates a Hospital or medical emergency zone. Drivers must refrain from sounding horns or creating noise disturbances in this sector.',
      },
      si: {
        question_text:
          'නිල් පැහැති සෘජුකෝණාස්‍රාකාර පුවරුවක සුදු පැහැති "H" අකුරක් සහිත සංඥාවෙන් දැක්වෙන්නේ:',
        options: [
          'ඉදිරියෙන් රෝහලක් ඇත (ශබ්ද නොකරන්න, අනවශ්‍ය නලා ශබ්ද කිරීම තහනම්)',
          'හෙලිකොප්ටර් ගොඩබෑමේ අංගනයකි',
          'හෝටල් හෝ නවාතැන් පහසුකම් කලාපයකි',
          'අධිවේගී මාර්ග පිටවීමකි',
        ],
        explanation:
          '"H" සලකුණ රෝහල් කලාපයක් දක්වන අතර එහිදී අනවශ්‍ය නලා නාද කිරීම තහනම්ය.',
      },
      ta: {
        question_text:
          'நீல நிற செவ்வக பலகையில் வெள்ளை "H" எழுத்து குறிப்பது:',
        options: [
          'முன்னால் வைத்தியசாலை உள்ளது (அமைதி காக்கவும், ஹோர்ன் அடிக்க தடை)',
          'ஹெலிகாப்டர் தளம்',
          'ஹோட்டல் அல்லது தங்குமிடம்',
          'நெடுஞ்சாலை வெளியேறும் வழி',
        ],
        explanation:
          '"H" அடையாளம் வைத்தியசாலை பகுதியை குறிப்பதால் அங்கு ஒலிப்பான் எழுப்பக் கூடாது.',
      },
    },
  },
]

export const SRI_LANKA_DMT_QUESTION_BANK = SRI_LANKA_DMT_MASTER_QUESTIONS
