import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DocumentsState {
  docs: any[];
  missingDocs:string[];
}

export const initialState: DocumentsState = {
  docs: [],
  missingDocs: []
};

const docsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (
      state: DocumentsState,
      action: PayloadAction<any[]>,
    ) => {
      state.docs = action.payload;
	  let missing = [];
    if (state.docs && state.docs.length > 0) {
      for (let i = 0; i < state.docs.length; i++) {
        if (!state.docs[i].uploaded) {
          missing.push(state.docs[i].type);
        }
      }
	}
      state.missingDocs = missing;
    },
  }
});

export const {
  setDocuments,
} = docsSlice.actions;

export default docsSlice.reducer;
