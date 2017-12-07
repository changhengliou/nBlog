import * as Counter from './CounterStore';
import * as About from './AboutStore';

export const reducers = {
    counter: Counter.reducer,
    about: About.reducer
};