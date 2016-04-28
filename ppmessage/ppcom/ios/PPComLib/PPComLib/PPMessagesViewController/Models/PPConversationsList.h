//
//  PPConversationsList.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/30/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"
#import "PPConversationItem.h"

@interface PPConversationsList : NSObject

@property (readonly) NSMutableArray *conversationList;

+(instancetype)listWithClient:(PPCom*)client listBody:(NSDictionary*)body;
-(instancetype)initWithClient:(PPCom*)client listBody:(NSDictionary*)body;

-(void)updateConversationList:(PPMessage*)newMessage;
-(void)addConversation:(PPConversationItem*)item;
-(void)removeConversation:(NSString*)conversationId;
-(void)removeAll;

@end
