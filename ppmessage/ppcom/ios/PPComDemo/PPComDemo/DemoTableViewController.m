//
//  DemoTableViewController.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "DemoTableViewController.h"
#import "FeedbackMessagesViewController.h"

@interface DemoTableViewController ()<FeedbackMessagesViewControllerDelegate>
@end

@implementation DemoTableViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"PPComDemoViewController";
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.tableView deselectRowAtIndexPath:[self.tableView indexPathForSelectedRow] animated:YES];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 2;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    switch (section) {
        case 0:
            return 2;
        case 1:
            return 2;
    }
    return 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"CellIdentifier";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    }
    
    if (indexPath.section == 0) {
        switch (indexPath.row) {
            case 0:
                cell.textLabel.text = @"Push via storyboard";
                break;
            case 1:
                cell.textLabel.text = @"Push programmatically";
                break;
        }
    } else if (indexPath.section == 1) {
        switch (indexPath.row) {
            case 0:
                cell.textLabel.text = @"Modal via storyboard";
                break;
            case 1:
                cell.textLabel.text = @"Modal programmatically";
                break;
        }
    }
    
    return cell;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    switch (section) {
        case 0:
            return @"Presentation";
        default:
            return nil;
    }
}

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section == 0) {
        switch (indexPath.row) {
            case 0:
                [self performSegueWithIdentifier:@"seguePushDemoVC" sender:self];
                break;
                
            case 1:
            {
                FeedbackMessagesViewController *feedbackViewController = [[FeedbackMessagesViewController alloc] init];
                [self.navigationController showViewController:feedbackViewController sender:self];
            }
                break;
        }
    } else if (indexPath.section == 1) {
        switch (indexPath.row) {
            case 0:
                [self performSegueWithIdentifier:@"segueModalDemoVC" sender:self];
                break;
                
            case 1:
            {
                FeedbackMessagesViewController *feedbackViewController = [[FeedbackMessagesViewController alloc] init];
                UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:feedbackViewController];
                feedbackViewController.delegateModal = self;
                [self presentViewController:navigationController animated:YES completion:nil];
            }
                break;
        }
    }
}

#pragma mark - Segues

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"segueModalDemoVC"]) {
        UINavigationController *navigationController = segue.destinationViewController;
        FeedbackMessagesViewController *feedbackViewController = (FeedbackMessagesViewController*)navigationController.topViewController;
        feedbackViewController.delegateModal = self;
    }
}

#pragma mark - Feedback delegate

- (void)didDismissFeedbackViewController:(FeedbackMessagesViewController *)vc {
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
