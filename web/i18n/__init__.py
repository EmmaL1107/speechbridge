"""国际化翻译"""

from __future__ import annotations

# 翻译字典
TRANSLATIONS = {
    "zh": {
        # 导航
        "nav.home": "录音/上传",
        "nav.history": "历史记录",
        "nav.profile": "个人设置",
        "nav.logout": "退出",
        "nav.login": "登录",
        "nav.register": "注册",

        # 首页
        "hero.title": "智能语义恢复系统",
        "hero.subtitle": "理解你想表达什么，而不仅仅是识别你说了什么",
        "upload.title": "录音 / 上传音频",
        "upload.record_hint": "点击麦克风录音",
        "upload.recording": "录音中…",
        "upload.record_done": "录音完成",
        "upload.or": "或",
        "upload.drag_hint": "拖拽文件或",
        "upload.click_select": "点击选择",
        "upload.format_hint": "WAV / MP3 / M4A / FLAC",
        "upload.scene": "应用场景",
        "upload.scene.general": "🌐 通用",
        "upload.scene.meeting": "🏢 会议",
        "upload.scene.education": "📚 教育",
        "upload.scene.medical": "🏥 医疗",
        "upload.scene.accessibility": "♿ 无障碍",
        "upload.accessibility": "语言障碍模式",
        "upload.accessibility_hint": "口吃消除、断续拼接、语速归一化",
        "upload.submit": "🚀 开始处理",
        "upload.processing": "处理中…",
        "upload.rerecord": "🔄 重录",

        # 特性
        "feature.semantic": "语义恢复",
        "feature.semantic_desc": "从错误的语音识别中推断真实意图",
        "feature.accent": "口音友好",
        "feature.accent_desc": "支持各种非标准英语口音",
        "feature.accessible": "无障碍",
        "feature.accessible_desc": "语言障碍用户专项处理",
        "feature.scene": "场景适配",
        "feature.scene_desc": "会议、教育、医疗差异化处理",

        # 结果页
        "result.done": "处理完成",
        "result.processing": "处理中...",
        "result.error": "处理失败",
        "result.original": "原始转录",
        "result.corrected": "纠正后文本",
        "result.confidence": "置信度",
        "result.language": "语言",
        "result.duration": "时长",
        "result.recovery_confidence": "恢复置信度",
        "result.intent": "意图",
        "result.entities": "提取的实体",
        "result.corrections": "纠正详情",
        "result.actions": "行动项",
        "result.back": "← 返回",
        "result.history": "📋 历史",
        "result.delete": "🗑 删除",
        "result.processing_hint": "语音识别 + 语义恢复中…",

        # 历史
        "history.title": "历史记录",
        "history.empty": "暂无记录",
        "history.upload_first": "去上传",
        "history.file": "文件",
        "history.scene": "场景",
        "history.original": "原始转录",
        "history.corrected": "纠正文本",
        "history.confidence": "置信度",
        "history.time": "耗时",
        "history.status": "状态",
        "history.created": "时间",

        # 登录/注册
        "auth.login": "登录",
        "auth.register": "注册",
        "auth.username": "用户名",
        "auth.password": "密码",
        "auth.confirm_password": "确认密码",
        "auth.email": "邮箱",
        "auth.login_btn": "登录",
        "auth.register_btn": "注册",
        "auth.no_account": "还没有账号？",
        "auth.has_account": "已有账号？",
        "auth.login_success": "登录成功",
        "auth.register_success": "注册成功",
        "auth.logout_success": "已退出登录",

        # 个人设置
        "profile.title": "个人设置",
        "profile.username": "用户名",
        "profile.email": "邮箱",
        "profile.default_scene": "默认场景",
        "profile.default_accessibility": "默认启用语言障碍模式",
        "profile.language": "界面语言",
        "profile.save": "💾 保存",
        "profile.saved": "设置已保存",

        # Footer
        "footer.text": "智能语义恢复系统 · 理解你想表达什么",
    },
    "en": {
        # Nav
        "nav.home": "Record / Upload",
        "nav.history": "History",
        "nav.profile": "Settings",
        "nav.logout": "Logout",
        "nav.login": "Login",
        "nav.register": "Register",

        # Home
        "hero.title": "Intelligent Semantic Recovery",
        "hero.subtitle": "Understanding what you mean, not just what you say",
        "upload.title": "Record / Upload Audio",
        "upload.record_hint": "Tap mic to record",
        "upload.recording": "Recording…",
        "upload.record_done": "Done",
        "upload.or": "or",
        "upload.drag_hint": "Drag or",
        "upload.click_select": "select file",
        "upload.format_hint": "WAV / MP3 / M4A / FLAC",
        "upload.scene": "Scene",
        "upload.scene.general": "🌐 General",
        "upload.scene.meeting": "🏢 Meeting",
        "upload.scene.education": "📚 Education",
        "upload.scene.medical": "🏥 Medical",
        "upload.scene.accessibility": "♿ Accessibility",
        "upload.accessibility": "Accessibility Mode",
        "upload.accessibility_hint": "Stutter removal, fragment merging, speed normalization",
        "upload.submit": "🚀 Start",
        "upload.processing": "Processing…",
        "upload.rerecord": "🔄 Re-record",

        # Features
        "feature.semantic": "Semantic Recovery",
        "feature.semantic_desc": "Infer true intent from erroneous ASR",
        "feature.accent": "Accent Friendly",
        "feature.accent_desc": "Supports various non-standard accents",
        "feature.accessible": "Accessible",
        "feature.accessible_desc": "Special support for speech disorders",
        "feature.scene": "Scene Adaptation",
        "feature.scene_desc": "Meeting, education, medical differentiation",

        # Result
        "result.done": "Processing Complete",
        "result.processing": "Processing...",
        "result.error": "Processing Failed",
        "result.original": "Original Transcript",
        "result.corrected": "Corrected Text",
        "result.confidence": "Confidence",
        "result.language": "Language",
        "result.duration": "Duration",
        "result.recovery_confidence": "Recovery Confidence",
        "result.intent": "Intent",
        "result.entities": "Extracted Entities",
        "result.corrections": "Corrections",
        "result.actions": "Action Items",
        "result.back": "← Back",
        "result.history": "📋 History",
        "result.delete": "🗑 Delete",
        "result.processing_hint": "ASR + semantic recovery in progress…",

        # History
        "history.title": "History",
        "history.empty": "No records yet",
        "history.upload_first": "Upload",
        "history.file": "File",
        "history.scene": "Scene",
        "history.original": "Original",
        "history.corrected": "Corrected",
        "history.confidence": "Confidence",
        "history.time": "Time",
        "history.status": "Status",
        "history.created": "Created",

        # Auth
        "auth.login": "Login",
        "auth.register": "Register",
        "auth.username": "Username",
        "auth.password": "Password",
        "auth.confirm_password": "Confirm Password",
        "auth.email": "Email",
        "auth.login_btn": "Login",
        "auth.register_btn": "Register",
        "auth.no_account": "Don't have an account?",
        "auth.has_account": "Already have an account?",
        "auth.login_success": "Login successful",
        "auth.register_success": "Registration successful",
        "auth.logout_success": "Logged out",

        # Profile
        "profile.title": "Settings",
        "profile.username": "Username",
        "profile.email": "Email",
        "profile.default_scene": "Default Scene",
        "profile.default_accessibility": "Enable Accessibility by Default",
        "profile.language": "Interface Language",
        "profile.save": "💾 Save",
        "profile.saved": "Settings saved",

        # Footer
        "footer.text": "Intelligent Semantic Recovery · Understanding what you mean",
    },
}


def t(key: str, lang: str = "zh") -> str:
    """翻译函数"""
    return TRANSLATIONS.get(lang, TRANSLATIONS["zh"]).get(key, key)
