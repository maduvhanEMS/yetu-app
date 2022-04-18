const PDFGenerator = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

class InvoiceGenerator {
  constructor(data) {
    this.data = data;
  }

  getDays(d1, d2, get_item) {
    var date1 = new Date(d1);
    var date2 = new Date(d2);
    var Difference_In_Time = date1.getTime() - date2.getTime();
    switch (get_item) {
      case 'month':
        return Math.round(Difference_In_Time / (1000 * 3600 * 24 * 30));
      case 'day':
        return Math.round(Difference_In_Time / (1000 * 3600 * 24));
      case 'hour':
        return Math.round(Difference_In_Time / (1000 * 3600));
      case 'minute':
        return Math.round(Difference_In_Time / (1000 * 60));
      case 'second':
        return Math.round(Difference_In_Time / 1000);
      default:
        break;
    }
  }

  overdueTasks(data, getDays) {
    return data.tasks.filter(
      (item) => !item.outcomes && getDays(item.endDate, new Date(), 'day') < 0
    );
  }

  outstandingTasks(data) {
    return data?.tasks?.filter((item) => !item.outcomes);
  }

  remainingTasks(data, getDays) {
    return data?.tasks?.filter(
      (item) => !item.outcomes && getDays(item.endDate, new Date(), 'day') >= 0
    );
  }
  completedTasks(data) {
    return data?.tasks?.filter((item) => item.outcomes);
  }

  generateHeaders(doc) {
    doc
      .image(path.join(__dirname, './yetu.PNG'), 410, 10, {
        fit: [150, 150],
        align: 'left',
        valign: 'left',
      })
      .fillColor('#000')
      .fontSize(10);

    const beginningOfPage = 50;
    const endOfPage = 550;
    doc.fontSize(12).fillColor('blue').text(`Monthly Report`, 50, 80, {});

    //Add a table
    const top = 110;
    const SecondTop = 135;
    const ThirdTop = 160;
    const To = 50;
    const From = 350;
    const Phone = 50;
    const date = 350;
    const Re = 50;

    doc
      .fontSize(10)
      .fillColor('black')
      .text('To: ', To, top, { bold: false })
      .text('From: ', From, top)
      .moveTo(beginningOfPage, 125)
      .lineTo(endOfPage, 125)
      .stroke();

    doc
      .text('Phone: ', Phone, SecondTop, { bold: false })
      .text(`Date: `, date, SecondTop)
      .moveTo(beginningOfPage, 150)
      .lineTo(endOfPage, 150)
      .stroke();

    doc
      .text('Re:', Re, ThirdTop, { bold: false })
      .moveTo(beginningOfPage, 175)
      .lineTo(endOfPage, 175)
      .stroke();

    //add data
    doc
      .text('Yetu Investments Shareholders', To + 40, top)
      .text('Yetu Investments Directors', From + 30, top)
      .text('0761377613', Phone + 40, SecondTop)
      .text(`${moment(new Date()).format('LL')}`, date + 30, SecondTop)
      .text('Tast Management - Monthly Report', Re + 40, ThirdTop);
  }

  generateContent(doc) {
    doc
      .fontSize(8)
      .fillColor('blue')
      .text(`A. Projects Summary`, 50, 200, { bold: true });

    //table of projects
    const tableTop = 240;
    const itemNumberX = 50;
    const descriptionX = 100;
    const ownerX = 330;
    const statusX = 460;

    // headings
    doc
      .fillColor('black')
      .text('No.', itemNumberX, tableTop, { bold: true })
      .text('Description', descriptionX, tableTop, { bold: true })
      .text('Project Owner', ownerX, tableTop, { bold: true })
      .text('Status', statusX, tableTop, { bold: true });

    //populate table
    const projects = this.data.projects;
    let y;
    for (var i = 0; i < projects.length; i++) {
      const project = projects[i];
      y = tableTop + 25 + i * 25;
      let perc = Math.floor(
        (project.tasks.filter((item) => item.outcomes).length /
          project.numOfTasks) *
          100
      );
      let status = isNaN(perc) ? 0 : perc;
      let color;
      if (status >= 80) {
        color = 'green';
      } else if (project.status >= 50 && project.status < 80) {
        color = 'blue';
      } else if (project.status >= 20 && project.status < 50) {
        color = 'yellow';
      } else {
        color = 'red';
      }

      // status color
      doc
        .lineWidth(15)
        .lineCap('butt')
        .moveTo(statusX, y + 4)
        .lineTo(statusX + 20, y + 4)
        .fillAndStroke(color);

      doc
        .fontSize(7)
        .fillColor('black')
        .text(i + 1 + `.`, itemNumberX, y)
        .text(project.project_name, descriptionX, y)
        .text(project.owner.join(' ').split(' ')[0], ownerX, y)
        .text(status + '%', statusX + 30, y);
    }
    //logic to add a new or properly arrange
    if (700 - y < 300) {
      doc.fontSize(10).text(`page 1 `, 50, 700, {
        align: 'center',
      });
      doc.addPage();
      y = 40;
    }

    const names = ['Completed', 'Remaining', 'Overdue'];
    const widthX = [160, 250, 340];
    const colorsNames = ['green', 'blue', 'red'];
    for (var i = 0; i < names.length; i++) {
      //get y
      let colorsx = colorsNames[i];
      let w = widthX[i];
      doc
        .lineWidth(15)
        .lineCap('butt')
        .moveTo(w, y + 290)
        .lineTo(w + 20, y + 290)
        .fillAndStroke(colorsx);

      doc
        .fontSize(10)
        .fillColor('black')
        .text(names[i], widthX[i] + 25, y + 286);
    }

    // workload information
    doc
      .fontSize(12)
      .fillColor('blue')
      .text(`Workload`, 160, y + 50, { bold: true });

    // create the status data status
    let data = [];
    const tasks = this.data.user;

    for (var i = 0; i < tasks.length; i++) {
      let obj = {};
      let taskStatus = [];
      let completed = {};
      let remaining = {};
      let overdue = {};
      obj['name'] = tasks[i].username.split(' ')[0];
      completed['completed'] = tasks[i].tasks.filter(
        (item) => item.outcomes
      ).length;

      remaining['remaining'] = tasks[i].tasks.filter(
        (item) =>
          !item.outcomes && this.getDays(item.endDate, new Date(), 'day') > 0
      ).length;

      overdue['overdue'] = tasks[i].tasks.filter(
        (item) =>
          !item.outcomes && this.getDays(item.endDate, new Date(), 'day') <= 0
      ).length;
      taskStatus.push(completed);
      taskStatus.push(remaining);
      taskStatus.push(overdue);
      obj['taskStatus'] = taskStatus;
      data.push(obj);
    }

    let yBlocks;

    for (var i = 0; i < data.length; i++) {
      yBlocks = y + 25 + i * 25;
      let color;
      let x = 120;
      let inc = 0;
      for (var j = 0; j < data[i].taskStatus.length; j++) {
        const task = data[i].taskStatus[j];

        if (Object.keys(task)[0] === 'completed') {
          color = 'green';
        } else if (Object.keys(task)[0] === 'remaining') {
          color = 'blue';
        } else {
          color = 'red';
        }

        inc = Object.values(task)[0];
        doc
          .lineWidth(15)
          .lineCap('butt')
          .moveTo(x, yBlocks + 70)
          .lineTo(x + inc, yBlocks + 70)
          .fillAndStroke(color);

        x = x + Object.values(task)[0];
      }

      doc
        .fontSize(10)
        .fillColor('black')
        .text(data[i].name, 50, yBlocks + 66);
    }

    //graphs
    doc
      .fontSize(12)
      .fillColor('blue')
      .text(`Tasks Status`, 416, y + 50, { bold: true })
      .image(path.join(__dirname, '../Charts/dognut.png'), 300, y + 60, {
        fit: [300, 300],
        align: 'left',
        valign: 'left',
      })
      .fillColor('#000')
      .fontSize(10);

    //generate health table
    const health = {
      time: Math.round(
        (this.overdueTasks(this.data, this.getDays).length /
          this.outstandingTasks(this.data).length) *
          100,
        2
      ),
      tasks: this.remainingTasks(this.data, this.getDays).length,
      workload: this.overdueTasks(this.data, this.getDays).length,
      progress: Math.round(
        (this.completedTasks(this.data).length / this.data.tasks.length) * 100,
        2
      ),
      month: this.data.tasks.filter(
        (item) =>
          item.outcomes &&
          this.getDays(item.updatedAt, new Date(), 'month') === 0
      ).length,
    };

    const healthInfo = [
      'behind schedule.',
      'tasks to be completed.',
      'tasks overdue.',
      'complete.',
      'tasks completed.',
    ];

    //
    if (700 - (yBlocks + 300) < 300) {
      doc.fontSize(10).text(`page 1 `, 50, 700, {
        align: 'center',
      });
      doc.addPage();
      yBlocks = 50;
    } else {
      yBlocks = 350;
    }

    doc
      .fontSize(12)
      .fillColor('blue')
      .text(`Health`, 160, yBlocks + 50, { bold: true });

    for (var i = 0; i < Object.keys(health).length; i++) {
      const yaxis = yBlocks + 25 + i * 25;
      const healthName =
        Object.keys(health)[i].charAt(0).toUpperCase() +
        Object.keys(health)[i].slice(1);
      doc
        .fontSize(10)
        .fillColor('green')
        .text(healthName, 50, yaxis + 70)
        .fillColor('black')
        .text(
          healthName === 'Time' || healthName === 'Progress'
            ? Object.values(health)[i] + '% ' + healthInfo[i]
            : Object.values(health)[i] + ' ' + healthInfo[i],
          150,
          yaxis + 70
        )
        .moveTo(50, yaxis + 86)
        .lineTo(260, yaxis + 86)
        .fillAndStroke('#f5f5f5');
    }

    //graphs
    doc
      .fontSize(12)
      .fillColor('blue')
      .text(`Task Per Project`, 416, yBlocks + 50, { bold: true })
      .image(
        path.join(__dirname, '../Charts/barchart.png'),
        300,
        yBlocks + 60,
        {
          fit: [300, 300],
          align: 'left',
          valign: 'left',
        }
      );

    doc
      .fontSize(12)
      .fillColor('blue')
      .text(`B. Project Timelines`, 50, yBlocks + 300, { bold: true });
  }

  generateFooter(doc) {
    doc.fontSize(10).text(`Payment due upon receipt. `, 50, 700, {
      align: 'center',
    });
  }

  generate() {
    let theOutput = new PDFGenerator();

    const fileName = `Projects.pdf`;

    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(
      fs.createWriteStream(path.join(__dirname, `../pdf/${fileName}`))
    );

    this.generateHeaders(theOutput);

    theOutput.moveDown();

    this.generateContent(theOutput);

    this.generateFooter(theOutput);

    // write out file
    theOutput.end();
  }
}

module.exports = InvoiceGenerator;
