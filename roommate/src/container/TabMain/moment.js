import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import MomentRoot from './momentStack/momentShow.js';
import EditMomentScreen from './momentStack/editMoment.js';
import CommentScreen from './momentStack/comment.js';

const MomentScreen = StackNavigator({
	MomentRoot: {
		screen: MomentRoot,
	},
	EditMoment: {
		screen: EditMomentScreen, 
	},
	Comment: {
		screen: CommentScreen,
	},
})

export default MomentScreen;