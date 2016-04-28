//
//  PPMessageReceiver.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"
#import "PPMessage.h"
#import "SRWebSocket.h"
#import "PPAppInfo.h"

@protocol PPMessageReceiverDelegate <NSObject>

@required

/**
 * Receive new message
 */
-(void)didReceiveMessage:(PPMessage*)message;

@optional

/**
 * WebSocket did open
 */
-(void)didWebSocketOpen;

/**
 * WebSocket throws some error
 */
-(void)didWebSocketFailWithError:(NSError*)error;

/**
 * WebSocket did close
 */
-(void)didWebSocketClose;

@end

@interface PPMessageReceiver : PPComNet

@property (nonatomic, weak) id<PPMessageReceiverDelegate> delegate;

-(instancetype)init:(PPCom*)client appInfo:(PPAppInfo *)app;

-(void)open;
-(void)openWithDelegate:(id<PPMessageReceiverDelegate>)delegate;
-(void)close;

@end
