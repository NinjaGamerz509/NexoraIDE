import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    provider: { type: String, enum: ['google', 'github'], required: true },
    providerId: { type: String, required: true },
    settings: {
      theme: { type: String, enum: ['dark', 'light', 'aqua', 'system'], default: 'dark' },
      workspaceTheme: { type: String, enum: ['dark', 'light', 'system'], default: 'system' },
      fontSize: { type: Number, default: 14 },
      fontFamily: { type: String, default: 'JetBrains Mono' },
      tabSize: { type: Number, default: 2 },
      wordWrap: { type: Boolean, default: true },
      autoSave: { type: Boolean, default: true },
      minimap: { type: Boolean, default: true },
      lineNumbers: { type: Boolean, default: true },
      indentGuides: { type: Boolean, default: true },
      bracketPairColorization: { type: Boolean, default: true },
      smoothScrolling: { type: Boolean, default: true },
      cursorSmoothCaretAnimation: { type: Boolean, default: true },
      formatOnSave: { type: Boolean, default: true },
      stickyScroll: { type: Boolean, default: true },
    },
    customShortcuts: {
      type: Map,
      of: String,
      default: {},
    },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
