import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KidoLearn Zone Demo
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Demo Video Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 mx-auto">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning Demo</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Watch how kids learn through fun activities, earn points, and unlock achievements in our gamified learning platform.
              </p>
            </div>
          </div>

          {/* Demo Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-3xl mb-2">🎮</div>
              <h4 className="font-semibold mb-1">Gamified Learning</h4>
              <p className="text-sm text-muted-foreground">
                Points, levels, and achievements make learning fun and engaging.
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-semibold mb-1">Interactive Lessons</h4>
              <p className="text-sm text-muted-foreground">
                Videos, quizzes, and hands-on activities for better understanding.
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold mb-1">Progress Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Real-time progress monitoring and personalized learning paths.
              </p>
            </div>
          </div>

          {/* Demo Stats */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h4 className="font-semibold mb-4 text-center">Platform Highlights</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Start Your Free Trial
            </Button>
            <Button variant="outline" onClick={onClose}>
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;