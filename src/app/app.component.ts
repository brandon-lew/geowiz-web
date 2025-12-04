import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// INTERFACES
import { ICountry } from './interfaces/country.model';

// SERVICES
import { CountriesService } from './services/countries.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isOverlay = false;
  isDisplayQuestion = true;
  isActiveCapital = true;
  isActiveFlag = true;
  isActiveShape = true;
  isActiveHardcore = false;
  errorMessage!: string;
  countries!: ICountry[];
  questionCapital!: string[];
  questionFlag!: string;
  questionId = 'us';
  answer!: string;
  response!: string;

  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.generateQuiz();
    // FOR TESTING ONLY
    // Test country data (leave commented out)
    // this.generateDataTest();
  }

  // Generate Quiz data
  generateQuiz() {
    // Get data
    this.countriesService.getCountries().subscribe({
      next: (data: ICountry[]) => {
        // Reset question display
        this.isDisplayQuestion = true;
        // Apply capital filter
        const removeCapitals = this.capitalFilter(data);
        // Apply image filter
        const removeImages = this.imageFilter(removeCapitals);
        // Randomize remaining data - pass #1
        const randomizedData1 = this.randomize(removeImages);
        // Randomize remaining data - pass #2
        const randomizedData2 = this.randomize(randomizedData1);
        // Randomize remaining data - pass #3
        const randomizedData3 = this.randomize(randomizedData2);
        // Get 10 countries
        const group = this.group10(randomizedData3);
        // Pick and set question and answer
        this.questionCapital = group[0].capital;
        this.questionFlag = group[0].flag;
        this.questionId = group[0].cca2.toLowerCase();
        this.answer = group[0].name.common;
        // Sort group of countries for selection
        const sortedGroup = this.sort(group);
        // Set group of countries for selection
        this.countries = sortedGroup;
        // If Hardcore is active, hide question after 2 seconds (actually .25 seconds due to 1 second overlay)
        if (this.isActiveHardcore === true) {
          setTimeout(() => {
            this.isDisplayQuestion = false;
          }, 1250);
        }
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  // Filter out countries with no images
  imageFilter(data: ICountry[]): ICountry[] {
    const noImages = [
      'Micronesia',
      'Jersey',
      'Marshall Islands',
      'Northern Mariana Islands',
      'Palestine',
      'Tuvalu',
      'United States Minor Outlying Islands',
    ];
    const group = data.filter((item) => !noImages.includes(item.name.common));
    return group;
  }

  // Filter out countries with no capitals
  capitalFilter(data: ICountry[]): ICountry[] {
    const group: ICountry[] = [];
    data.forEach((element) => {
      if (element.capital.length !== 0) {
        group.push(element);
      }
    });
    return group;
  }

  // Sort data
  sort(data: ICountry[]): ICountry[] {
    data.sort((a, b) => {
      if (a.name.common < b.name.common) return -1;
      if (a.name.common > b.name.common) return 1;
      return 0;
    });
    return data;
  }

  // Randomize data
  randomize(data: ICountry[]): ICountry[] {
    for (let x = data.length - 1; x > 0; x--) {
      const y = Math.floor(Math.random() * (x + 1));
      const temp = data[x];
      data[x] = data[y];
      data[y] = temp;
    }
    return data;
  }

  // Get group of 10
  group10(data: ICountry[]): ICountry[] {
    const group = [];
    for (let x = 0; x < 10; x++) {
      group.push(data[x]);
    }
    return group;
  }

  // Change event
  onChange(selection: string): void {
    if (this.answer === selection) {
      // Correct overlay
      this.isOverlay = true;
      this.response = 'Correct';
      setTimeout(() => {
        this.isOverlay = false;
        this.response = '';
      }, 1000);
      this.generateQuiz();
    } else {
      // Incorrect overlay
      this.isOverlay = true;
      this.response = 'Incorrect';
      setTimeout(() => {
        this.isOverlay = false;
        this.response = '';
      }, 1000);
      // If Hardcore is active, redisplay question then hide question again
      if (this.isActiveHardcore === true) {
        this.isDisplayQuestion = true;
        setTimeout(() => {
          this.isDisplayQuestion = false;
        }, 1250);
      }
    }
  }

  // Check isActive status
  activeCheck(isActive: boolean): boolean {
    if (isActive === true) {
      return false;
    } else {
      return true;
    }
  }

  // Toggle event
  onToggle(event: string): void {
    switch (event) {
      case 'capital':
        // Toggle capital settings
        this.isActiveCapital = this.activeCheck(this.isActiveCapital);
        this.generateQuiz();
        break;
      case 'flag':
        // Toggle flag settings
        this.isActiveFlag = this.activeCheck(this.isActiveFlag);
        this.generateQuiz();
        break;
      case 'shape':
        // Toggle shape settings
        this.isActiveShape = this.activeCheck(this.isActiveShape);
        this.generateQuiz();
        break;
      case 'hardcore':
        // Toggle hardcore settings
        this.isActiveHardcore = this.activeCheck(this.isActiveHardcore);
        this.isDisplayQuestion = this.activeCheck(this.isActiveHardcore);
        // Display 1 second title overlay
        if (this.isActiveHardcore === true) {
          this.isOverlay = true;
          this.response = 'Hardcore Mode';
          setTimeout(() => {
            this.isOverlay = false;
            this.response = '';
          }, 1000);
        }
        this.generateQuiz();
        break;
    }
  }

  // Generate data test
  generateDataTest() {
    // Get data
    this.countriesService.getCountries().subscribe({
      next: (data: ICountry[]) => {
        // Reset question display
        this.isDisplayQuestion = true;
        // Get test country data
        const group = this.countrySearch(data);
        // Pick and set question and answer
        this.questionCapital = group[0].capital;
        this.questionFlag = group[0].flag;
        this.questionId = group[0].cca2.toLowerCase();
        this.answer = group[0].name.common;
        // Sort group of countries for selection
        const sortedGroup = this.sort(group);
        // Set group of countries for selection
        this.countries = sortedGroup;
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  // Search for country
  countrySearch(data: ICountry[]): ICountry[] {
    const country = 'Bonaire, Sint Eustatius and Saba';
    const group: ICountry[] = [];
    data.forEach((element) => {
      if (element.name.common === country) {
        group.push(element);
      }
    });
    return group;
  }
}
